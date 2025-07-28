import { NextRequest, NextResponse } from "next/server";
import { supabase, createServerSupabaseClient } from "@/lib/supabase";
import { Review, ReviewSubmission, generateId } from "@/lib/db";

// GET /api/reviews - Get approved reviews
export async function GET() {
  try {
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch reviews" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: reviews || [],
      count: reviews?.length || 0,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Submit new review
export async function POST(request: NextRequest) {
  try {
    const body: ReviewSubmission = await request.json();

    // Validate required fields
    if (
      !body.name ||
      !body.rating ||
      !body.service ||
      !body.review ||
      !body.consent
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Validate rating
    const ratingNum = Number(body.rating);
    if (
      isNaN(ratingNum) ||
      ratingNum < 1 ||
      ratingNum > 5 ||
      !Number.isInteger(ratingNum)
    ) {
      return NextResponse.json(
        { success: false, error: "Rating must be an integer between 1 and 5" },
        { status: 400 }
      );
    }

    // Validate service
    const validServices = ["standing-flower", "standing-banner", "both"];
    if (!validServices.includes(body.service)) {
      return NextResponse.json(
        { success: false, error: "Invalid service type" },
        { status: 400 }
      );
    }

    // Validate consent
    if (!body.consent) {
      return NextResponse.json(
        { success: false, error: "Consent is required" },
        { status: 400 }
      );
    }

    // Use server client for inserting data
    const serverSupabase = createServerSupabaseClient();

    const newReview: Omit<Review, "id"> = {
      name: body.name.trim(),
      email: body.email?.trim() || undefined,
      rating: ratingNum, // Use validated rating
      service: body.service,
      review: body.review.trim(),
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Debug logging
    console.log("Rating received:", body.rating, "Type:", typeof body.rating);
    console.log(
      "Rating converted:",
      newReview.rating,
      "Type:",
      typeof newReview.rating
    );

    const { data: review, error } = await serverSupabase
      .from("reviews")
      .insert([newReview])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to submit review" },
        { status: 500 }
      );
    }

    console.log("New review created:", review.id, review.name);

    return NextResponse.json(
      {
        success: true,
        message: "Review submitted successfully and is pending approval",
        data: {
          id: review.id,
          name: review.name,
          rating: review.rating,
          service: review.service,
          status: review.status,
          created_at: review.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
