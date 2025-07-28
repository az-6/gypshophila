import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

// GET /api/admin/reviews - Get all reviews (admin only)
export async function GET() {
  try {
    const serverSupabase = createServerSupabaseClient();

    const { data: reviews, error } = await serverSupabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch reviews" },
        { status: 500 }
      );
    }

    const reviewsData = reviews || [];
    const stats = {
      total: reviewsData.length,
      approved: reviewsData.filter((r) => r.status === "approved").length,
      pending: reviewsData.filter((r) => r.status === "pending").length,
      rejected: reviewsData.filter((r) => r.status === "rejected").length,
    };

    return NextResponse.json({
      success: true,
      data: reviewsData,
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

    const serverSupabase = createServerSupabaseClient();

    const { data: updatedReview, error } = await serverSupabase
      .from("reviews")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", reviewId)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to update review" },
        { status: 500 }
      );
    }

    if (!updatedReview) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

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

    const serverSupabase = createServerSupabaseClient();

    // First get the review for logging
    const { data: reviewToDelete, error: fetchError } = await serverSupabase
      .from("reviews")
      .select("*")
      .eq("id", reviewId)
      .single();

    if (fetchError || !reviewToDelete) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    // Delete the review
    const { error: deleteError } = await serverSupabase
      .from("reviews")
      .delete()
      .eq("id", reviewId);

    if (deleteError) {
      console.error("Supabase delete error:", deleteError);
      return NextResponse.json(
        { success: false, error: "Failed to delete review" },
        { status: 500 }
      );
    }

    console.log("Review deleted:", reviewId, reviewToDelete.name);

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
      data: reviewToDelete,
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
