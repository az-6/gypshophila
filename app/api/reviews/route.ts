import { NextRequest, NextResponse } from "next/server";
import { fileStorage } from "@/lib/storage";
import { Review } from "@/lib/db";

// GET /api/reviews - Get approved reviews
export async function GET() {
  try {
    const reviews = await fileStorage.readReviews();
    const approvedReviews = reviews
      .filter((review) => review.status === "approved")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    return NextResponse.json({
      success: true,
      data: approvedReviews,
      count: approvedReviews.length,
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
    const body = await request.json();

    // Validate required fields
    const requiredFields = ["name", "rating", "service", "review", "consent"];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate rating
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
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

    // Create review
    const reviewData = {
      name: body.name.trim(),
      email: body.email?.trim() || undefined,
      rating: parseInt(body.rating),
      service: body.service,
      review: body.review.trim(),
      status: "pending" as const,
    };

    // Read existing reviews, add new one, and save
    const reviews = await fileStorage.readReviews();
    const newReview: Review = {
      ...reviewData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    reviews.push(newReview);
    await fileStorage.writeReviews(reviews);

    console.log("New review created:", newReview.id, newReview.name);

    return NextResponse.json(
      {
        success: true,
        message: "Review submitted successfully and is pending approval",
        data: {
          id: newReview.id,
          name: newReview.name,
          rating: newReview.rating,
          service: newReview.service,
          status: newReview.status,
          createdAt: newReview.createdAt,
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
