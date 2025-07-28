import { NextRequest, NextResponse } from "next/server";
import { fileStorage } from "@/lib/storage";

// GET /api/admin/reviews - Get all reviews (admin only)
export async function GET() {
  try {
    const reviews = await fileStorage.readReviews();
    const stats = {
      total: reviews.length,
      approved: reviews.filter((r) => r.status === "approved").length,
      pending: reviews.filter((r) => r.status === "pending").length,
      rejected: reviews.filter((r) => r.status === "rejected").length,
    };

    // Sort by creation date (newest first)
    const sortedReviews = reviews.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      success: true,
      data: sortedReviews,
      stats,
    });
  } catch (error) {
    console.error("Error fetching admin reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/reviews - Update review status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviewId, status } = body;

    if (!reviewId || !status) {
      return NextResponse.json(
        { success: false, error: "Review ID and status are required" },
        { status: 400 }
      );
    }

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Status must be either approved or rejected" },
        { status: 400 }
      );
    }

    // Read reviews, update the specific one, and save back
    const reviews = await fileStorage.readReviews();
    const reviewIndex = reviews.findIndex((review) => review.id === reviewId);

    if (reviewIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    // Update the review status
    reviews[reviewIndex] = {
      ...reviews[reviewIndex],
      status,
      updatedAt: new Date().toISOString(),
    };

    // Save the updated reviews
    await fileStorage.writeReviews(reviews);
    const updatedReview = reviews[reviewIndex];

    console.log("Review status updated:", reviewId, status);

    return NextResponse.json({
      success: true,
      message: `Review ${status} successfully`,
      data: updatedReview,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update review" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/reviews - Delete review
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviewId } = body;

    if (!reviewId) {
      return NextResponse.json(
        { success: false, error: "Review ID is required" },
        { status: 400 }
      );
    }

    // Read reviews, find and delete the specific one
    const reviews = await fileStorage.readReviews();
    const reviewIndex = reviews.findIndex((review) => review.id === reviewId);

    if (reviewIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    // Get the review data before deletion for logging
    const deletedReview = reviews[reviewIndex];

    // Remove the review from array
    reviews.splice(reviewIndex, 1);

    // Save the updated reviews
    await fileStorage.writeReviews(reviews);

    console.log("Review deleted:", reviewId, deletedReview.name);

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
      data: deletedReview,
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
