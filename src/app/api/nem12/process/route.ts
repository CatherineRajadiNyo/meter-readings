import { NextRequest, NextResponse } from "next/server";
import { processNEM12Stream } from "@/utils/nem12/processor";
import { generateSQLStatements } from "@/utils/sql/generator";

export const runtime = "edge";

/**
 * Handles POST requests to process NEM12 files.
 *
 * This endpoint:
 * 1. Accepts a multipart form data request with a NEM12 CSV file
 * 2. Processes the file stream with real-time progress updates
 * 3. Returns a stream of events with processing status and results
 *
 * @param {NextRequest} req - The incoming request object
 * @returns {Promise<NextResponse>} A streaming response with processing updates
 */
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Create a new TransformStream for streaming the response
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Start processing in the background
  (async () => {
    try {
      const blob = file as Blob;
      const fileStream = blob.stream();
      let totalBatches = 0;
      let totalReadings = 0;

      for await (const batch of processNEM12Stream(fileStream)) {
        const sqlStatement = generateSQLStatements(batch);
        totalBatches++;
        totalReadings += batch.length;

        // Send progress update
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "progress",
              sql: sqlStatement,
              totalBatches,
              totalReadings,
            })}\n\n`
          )
        );
      }

      // Send completion message
      await writer.write(
        encoder.encode(
          `data: ${JSON.stringify({
            type: "complete",
            totalBatches,
            totalReadings,
          })}\n\n`
        )
      );
    } catch (e: unknown) {
      // Send error message
      await writer.write(
        encoder.encode(
          `data: ${JSON.stringify({
            type: "error",
            error: e instanceof Error ? e.message : "Failed to process file",
          })}\n\n`
        )
      );
    } finally {
      await writer.close();
    }
  })();

  // Return streaming response
  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
