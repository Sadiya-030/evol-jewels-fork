import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import os from "os";

export async function POST(req) {
  console.log("api hit");
  const formData = await req.formData();
  const file = formData.get("audio");

  if (!file) {
    return NextResponse.json({ error: "No audio file" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  // Use os.tmpdir() for cross-platform compatibility (Windows/Linux/Mac)
  const filePath = path.join(os.tmpdir(), `audio-${Date.now()}.webm`);

  fs.writeFileSync(filePath, buffer);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const result = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "gpt-4o-transcribe", // or "whisper-1"
    });

    // Clean up temp file
    fs.unlinkSync(filePath);

    return NextResponse.json({ text: result.text });
  } catch (error) {
    // Clean up temp file on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error("Transcription error:", error);
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  }
}
