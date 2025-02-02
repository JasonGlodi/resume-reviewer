"use server";

import groq from "@/lib/groq";
import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "@/lib/validation";

export async function generateSummary(input: GenerateSummaryInput) {
  const { JobTitle, workExperiences, educations, skills } =
    generateSummarySchema.parse(input);

  const systemMessage = `
    You are a Job resume generator AI. Your task is to write a professional introduction summary for a resume given the user's provided data
    Only return the summary and do not include any other information in the response. Keep it concise and professional.
  `;

  const userMessage = `
    Please generate a professional resume summary from this data:
    
    Job title: ${JobTitle || "N/A"}
    Work experience: ${workExperiences
      ?.map(
        (exp) => `
        Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${
          exp.startDate || "N/A"
        } to ${exp.endDate || "Present"}
        Description: ${exp.description || "N/A"}
        `,
      )
      .join("\n\n")}
    Education: ${educations
      ?.map(
        (edu) => `
        Degree: ${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${
          edu.startDate || "N/A"
        } to ${edu.endDate || "N/A"}
        `,
      )
      .join("\n\n")}
    
    Skills: ${skills}
  `;

  console.log("systemMessage", systemMessage);
  console.log("userMessage", userMessage);

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      model: "llama3-70b-8192",
      temperature: 0.7, // Lower temperature for more focused professional responses
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false, // Set to false for simple implementation
      stop: null,
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("Failed to generate AI response");
    }

    return aiResponse;
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Failed to generate summary");
  }
}

export async function generateWorkExperience(
  input: GenerateWorkExperienceInput,
) {
  // TODO: Block non-premium users

  const { description } = generateWorkExperienceSchema.parse(input);

  const systemMessage = `
  You are a job resume generator AI. Your task is to generate a single work experience entry based on the user input.
  Your response must adhere to the following structure. You can omit fields if they can't be infered from the provided data but don't add any new ones.

  Job title: <job title>
  Company: <company name>
  Start date: <format: YYYY-MM-DD> (only if provided)
  End date: <format: YYYY-MM-DD> (only if provided)
  Description: <an optimized description in bullet format, might be infered from the job title>
  `;

  const userMessage = `
  Please Provide a user entry from this description:
  ${description}
  `;
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    model: "llama3-70b-8192",
    temperature: 0.7, // Lower temperature for more focused professional responses
    max_completion_tokens: 1024,
    top_p: 1,
    stream: false, // Set to false for simple implementation
    stop: null,
  });

  const aiResponse = chatCompletion.choices[0]?.message?.content;

  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  console.log("aiResponse", aiResponse);

  return {
    position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
    company: aiResponse.match(/Company: (.*)/)?.[1] || "",
    description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
    startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
    endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
  } satisfies WorkExperience;
}
