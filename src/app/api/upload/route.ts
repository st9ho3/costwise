/**
 * API route for uploading a file to Vercel Blob storage.
 * This route handles POST requests with a file body. It requires a `filename`
 * to be provided as a URL search parameter. The file is uploaded to Vercel Blob
 * with public access and a random suffix is added to the filename to prevent
 * naming conflicts. The function returns the details of the uploaded blob
 * in a JSON response. An error is returned if the `filename` or request body
 * is missing.
 */
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  // Get the filename from the search parameters
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename || !request.body) {
    return NextResponse.json(
      { message: "Missing filename or file body." },
      { status: 400 }
    );
  }

  // Upload the file to Vercel Blob storage
  const blob = await put(filename, request.body, {
    access: "public",
    addRandomSuffix: true,
  });

  // Return the blob details
  return NextResponse.json(blob);
}
