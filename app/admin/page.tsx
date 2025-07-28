"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatTimeAgo, getServiceDisplayName, Review } from "@/lib/db";
import StarRating from "@/components/ui/star-rating";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  BarChart3,
  LogOut,
  Home,
  Trash2,
} from "lucide-react";

interface AdminStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin-login");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/admin-login");
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/admin/reviews");
      const result = await response.json();

      if (result.success) {
        setReviews(result.data);
        setStats(result.stats);
      } else {
        console.error("Failed to fetch reviews:", result.error);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleStatusUpdate = async (
    reviewId: string,
    status: "approved" | "rejected"
  ) => {
    setProcessingIds((prev) => new Set(prev).add(reviewId));

    try {
      const response = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId,
          status,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setReviews((prev) =>
          prev.map((review) =>
            review.id === reviewId
              ? { ...review, status, updated_at: new Date().toISOString() }
              : review
          )
        );

        // Update stats
        setStats((prev) => {
          const oldReview = reviews.find((r) => r.id === reviewId);
          if (!oldReview) return prev;

          const newStats = { ...prev };

          // Decrease old status count
          if (oldReview.status === "pending") newStats.pending--;
          else if (oldReview.status === "approved") newStats.approved--;
          else if (oldReview.status === "rejected") newStats.rejected--;

          // Increase new status count
          if (status === "approved") newStats.approved++;
          else if (status === "rejected") newStats.rejected++;

          return newStats;
        });
      } else {
        alert("Failed to update review: " + result.error);
      }
    } catch (error) {
      console.error("Error updating review:", error);
      alert("Error updating review");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(reviewId);
        return newSet;
      });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    setProcessingIds((prev) => new Set(prev).add(reviewId));

    try {
      const response = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Remove review from local state
        setReviews((prev) => prev.filter((review) => review.id !== reviewId));

        // Update stats
        setStats((prev) => {
          const deletedReview = reviews.find((r) => r.id === reviewId);
          if (!deletedReview) return prev;

          const newStats = { ...prev };
          newStats.total--;

          // Decrease status count
          if (deletedReview.status === "pending") newStats.pending--;
          else if (deletedReview.status === "approved") newStats.approved--;
          else if (deletedReview.status === "rejected") newStats.rejected--;

          return newStats;
        });

        setDeleteConfirmId(null);
        alert("Review berhasil dihapus!");
      } else {
        alert("Failed to delete review: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Error deleting review");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(reviewId);
        return newSet;
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700">Disetujui</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700">Menunggu</Badge>
        );
      case "rejected":
        return <Badge className="bg-red-100 text-red-700">Ditolak</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderReviewCard = (review: Review) => (
    <Card key={review.id} className="mb-3 sm:mb-4">
      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs sm:text-sm">
                {review.name.charAt(0)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg truncate">{review.name}</CardTitle>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                {review.email || "No email provided"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:space-x-2">
            {getStatusBadge(review.status)}
            <Badge variant="outline" className="text-xs">
              {getServiceDisplayName(review.service)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="space-y-3 sm:space-y-4">
          <StarRating rating={review.rating} size="md" showLabel={true} />

          <p className="text-sm sm:text-base text-gray-700 italic break-words">"{review.review}"</p>

          <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 text-xs sm:text-sm text-gray-500">
            <span>Dibuat: {formatTimeAgo(review.created_at)}</span>
            <span>Diperbarui: {formatTimeAgo(review.updated_at)}</span>
          </div>

          {review.status === "pending" && (
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 pt-3 border-t">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                onClick={() => handleStatusUpdate(review.id, "approved")}
                disabled={processingIds.has(review.id)}
              >
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {processingIds.has(review.id) ? "Memproses..." : "Setujui"}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="text-xs sm:text-sm"
                onClick={() => handleStatusUpdate(review.id, "rejected")}
                disabled={processingIds.has(review.id)}
              >
                <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {processingIds.has(review.id) ? "Memproses..." : "Tolak"}
              </Button>
            </div>
          )}

          {/* Delete button - available for all reviews */}
          <div className="flex justify-end pt-3 border-t mt-3">
            {deleteConfirmId === review.id ? (
              <div className="flex flex-col space-y-3 w-full">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs sm:text-sm text-red-800 font-medium mb-1">
                    Konfirmasi Penghapusan
                  </p>
                  <p className="text-xs sm:text-sm text-red-700">
                    Yakin ingin menghapus review dari{" "}
                    <strong>{review.name}</strong>? Tindakan ini tidak dapat
                    dibatalkan.
                  </p>
                </div>
                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-end sm:space-y-0 sm:space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs sm:text-sm"
                    onClick={() => setDeleteConfirmId(null)}
                    disabled={processingIds.has(review.id)}
                  >
                    Batal
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="text-xs sm:text-sm"
                    onClick={() => handleDeleteReview(review.id)}
                    disabled={processingIds.has(review.id)}
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {processingIds.has(review.id)
                      ? "Menghapus..."
                      : "Ya, Hapus"}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="text-xs sm:text-sm text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                onClick={() => setDeleteConfirmId(review.id)}
                disabled={processingIds.has(review.id)}
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Hapus Review
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const pendingReviews = reviews.filter((r) => r.status === "pending");
  const approvedReviews = reviews.filter((r) => r.status === "approved");
  const rejectedReviews = reviews.filter((r) => r.status === "rejected");

  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-6xl">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              Admin Panel - Manajemen Review
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Kelola dan moderasi review dari pelanggan
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <Badge variant="secondary" className="text-xs sm:text-sm px-2 sm:px-3 py-1 self-center sm:self-auto">
              Total: {reviews.length} Review
            </Badge>
            <div className="flex space-x-2 sm:space-x-3">
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-3"
              >
                <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Home</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-3 text-red-600 border-red-600 hover:bg-red-50"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Review</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Menunggu</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Disetujui</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {stats.approved}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Ditolak</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600">
                  {stats.rejected}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4 sm:mb-6 h-auto">
          <TabsTrigger value="pending" className="flex items-center justify-center space-x-1 text-xs sm:text-sm py-2 px-1 sm:px-2">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Menunggu</span>
            <span className="xs:hidden">({stats.pending})</span>
            <span className="hidden xs:inline">({stats.pending})</span>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center justify-center space-x-1 text-xs sm:text-sm py-2 px-1 sm:px-2">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Disetujui</span>
            <span className="xs:hidden">({stats.approved})</span>
            <span className="hidden xs:inline">({stats.approved})</span>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center justify-center space-x-1 text-xs sm:text-sm py-2 px-1 sm:px-2">
            <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Ditolak</span>
            <span className="xs:hidden">({stats.rejected})</span>
            <span className="hidden xs:inline">({stats.rejected})</span>
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center justify-center space-x-1 text-xs sm:text-sm py-2 px-1 sm:px-2">
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Semua</span>
            <span className="xs:hidden">({stats.total})</span>
            <span className="hidden xs:inline">({stats.total})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="space-y-3 sm:space-y-4">
            {pendingReviews.length === 0 ? (
              <Card>
                <CardContent className="p-6 sm:p-8 text-center">
                  <Clock className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                    Tidak ada review yang menunggu
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">Semua review telah diproses</p>
                </CardContent>
              </Card>
            ) : (
              pendingReviews.map(renderReviewCard)
            )}
          </div>
        </TabsContent>

        <TabsContent value="approved">
          <div className="space-y-3 sm:space-y-4">
            {approvedReviews.length === 0 ? (
              <Card>
                <CardContent className="p-6 sm:p-8 text-center">
                  <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                    Belum ada review yang disetujui
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Review yang disetujui akan muncul di sini
                  </p>
                </CardContent>
              </Card>
            ) : (
              approvedReviews.map(renderReviewCard)
            )}
          </div>
        </TabsContent>

        <TabsContent value="rejected">
          <div className="space-y-3 sm:space-y-4">
            {rejectedReviews.length === 0 ? (
              <Card>
                <CardContent className="p-6 sm:p-8 text-center">
                  <XCircle className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                    Belum ada review yang ditolak
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Review yang ditolak akan muncul di sini
                  </p>
                </CardContent>
              </Card>
            ) : (
              rejectedReviews.map(renderReviewCard)
            )}
          </div>
        </TabsContent>

        <TabsContent value="all">
          <div className="space-y-3 sm:space-y-4">
            {reviews.length === 0 ? (
              <Card>
                <CardContent className="p-6 sm:p-8 text-center">
                  <Eye className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                    Belum ada review
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Review dari pelanggan akan muncul di sini
                  </p>
                </CardContent>
              </Card>
            ) : (
              reviews.map(renderReviewCard)
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Refresh Button */}
      <div className="text-center mt-6 sm:mt-8">
        <Button onClick={fetchReviews} variant="outline" className="text-sm sm:text-base px-4 sm:px-6">
          Refresh Data
        </Button>
      </div>
    </div>
  );
}
