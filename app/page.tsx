"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import StarRating from "@/components/ui/star-rating";
import {
  Heart,
  Sparkles,
  Clock,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Instagram,
} from "lucide-react";

export default function GypshophilaBoardy() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [approvedReviews, setApprovedReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Fetch approved reviews on component mount
  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews");
      const result = await response.json();

      if (result.success) {
        const formattedReviews = result.data.map((review: any) => ({
          id: review.id,
          name: review.name,
          rating: review.rating,
          review: review.review,
          service: getServiceDisplayName(review.service),
          date: formatTimeAgo(review.created_at),
        }));
        setApprovedReviews(formattedReviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Helper functions
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 hari yang lalu";
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    if (diffDays < 14) return "1 minggu yang lalu";
    if (diffDays < 21) return "2 minggu yang lalu";
    if (diffDays < 28) return "3 minggu yang lalu";
    if (diffDays < 60) return "1 bulan yang lalu";

    return `${Math.floor(diffDays / 30)} bulan yang lalu`;
  };

  const getServiceDisplayName = (service: string): string => {
    switch (service) {
      case "standing-flower":
        return "Standing Acrylic Flower";
      case "standing-banner":
        return "Standing Banner";
      case "both":
        return "Standing Flower & Banner";
      default:
        return service;
    }
  };

  // Fetch reviews on component mount
  React.useEffect(() => {
    fetchReviews();
  }, []);

  // Handle review form submission
  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    const formData = new FormData(e.currentTarget);
    const reviewData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      rating: rating,
      service: formData.get("service") as string,
      review: formData.get("review") as string,
      consent: formData.get("consent") === "on",
    };

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage({
          type: "success",
          text: "Terima kasih! Ulasan Anda telah dikirim dan sedang menunggu persetujuan admin. Ulasan akan muncul setelah disetujui.",
        });

        // Reset form
        (e.target as HTMLFormElement).reset();
        setRating(0);
      } else {
        setSubmitMessage({
          type: "error",
          text:
            result.error ||
            "Terjadi kesalahan saat mengirim ulasan. Silakan coba lagi.",
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setSubmitMessage({
        type: "error",
        text: "Terjadi kesalahan saat mengirim ulasan. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const galleryImages = [
    {
      id: 1,
      src: "1.png?height=400&width=300&text=+Acrylic+Flower+1",
      alt: "Acrylic Flower Design 1",
      category: "flower",
    },
    {
      id: 2,
      src: "4.png?height=300&width=400&text=Standing+Banner+1",
      alt: "Standing Banner Design 1",
      category: "banner",
    },
    {
      id: 3,
      src: "2.png?height=350&width=280&text=+Acrylic+Flower+2",
      alt: "Acrylic Flower Design 2",
      category: "flower",
    },
    {
      id: 4,
      src: "5.png?height=320&width=380&text=Standing+Banner+2",
      alt: "Standing Banner Design 2",
      category: "banner",
    },
    {
      id: 5,
      src: "3.png?height=380&width=290&text=Acrylic+Flower+3",
      alt: "Acrylic Flower Design 3",
      category: "flower",
    },
    {
      id: 6,
      src: "6.png?height=340&width=360&text=Standing+Banner+3",
      alt: "Standing Banner Design 3",
      category: "banner",
    },
  ];

  const sopItems = [
    {
      title: "1. Prosedur Penyewaan",
      items: [
        "Pelanggan dapat melakukan penyewaan melalui platform online kami (Instagram, Whatsapp) atau langsung ke toko fisik.",
        "Pelanggan wajib mengisi formulir penyewaan yang mencakup nama, alamat, nomor telepon, dan tanggal penggunaan board.",
        "Board ucapan yang diinginkan akan disediakan berdasarkan ketersediaan dan kebutuhan acara.",
        "Pembayaran penuh atau sebagian dilakukan di muka sesuai dengan kebijakan yang ditetapkan.",
      ],
    },
    {
      title: "2. Waktu Sewa",
      items: [
        "Waktu sewa board ucapan adalah 24 jam sejak pengambilan atau pengiriman.",
        "Pelanggan yang membutuhkan waktu lebih dapat mengajukan perpanjangan minimal 12 jam sebelum waktu pengembalian.",
        "Keterlambatan pengembalian akan dikenakan biaya tambahan sebesar 5% per jam dari harga sewa.",
      ],
    },
    {
      title: "3. Kerusakan Produk",
      items: [
        "Sebelum board diberikan kepada pelanggan, dilakukan pengecekan kondisi untuk memastikan tidak ada kerusakan.",
        "Pelanggan diharapkan memeriksa kondisi board saat menerima. Setiap kerusakan atau cacat yang ditemukan harus segera dilaporkan.",
        "Jika terjadi kerusakan pada board selama masa sewa (seperti bunga lepas, akrilik lecet, atau retak), pelanggan akan dikenakan biaya perbaikan atau penggantian sesuai dengan tingkat kerusakan.",
        "Kerusakan yang diakibatkan oleh pelanggan, termasuk akibat dari kelalaian atau kecelakaan, akan dikenakan biaya sesuai dengan nilai produk yang rusak.",
      ],
    },
    {
      title: "4. Pengiriman dan Pengambilan",
      items: [
        "Kami menyediakan layanan pengiriman dan pengambilan board ucapan dengan biaya tambahan. Pelanggan dapat juga mengambil dan mengembalikan board secara mandiri.",
        "Pengambilan dan pengembalian harus sesuai dengan waktu yang telah ditentukan untuk menghindari keterlambatan.",
      ],
    },
    {
      title: "5. Kebersihan dan Perawatan",
      items: [
        "Board ucapan yang dikembalikan harus dalam kondisi bersih dan terawat. Jika board dikembalikan dalam kondisi kotor, akan dikenakan biaya pembersihan sebesar 15.000 Rupiah.",
        "Kami tidak menerima board yang telah diubah, dimodifikasi, atau dihias tanpa izin.",
      ],
    },
    {
      title: "6. Pembatalan",
      items: [
        "Pembatalan penyewaan dapat dilakukan maksimal 3 hari sebelum tanggal sewa, dan uang muka akan dikembalikan sebesar 80%.",
        "Pembatalan di bawah 48 jam sebelum penyewaan akan dikenakan potongan 50% dari uang muka.",
      ],
    },
    {
      title: "7. Tanggung Jawab Pelanggan",
      items: [
        "Pelanggan bertanggung jawab atas pemakaian board selama masa sewa. Pelanggan wajib menggunakan board dengan hati-hati agar tidak menyebabkan kerusakan.",
        "Board tidak boleh dipinjamkan atau disewakan kembali kepada pihak ketiga tanpa izin tertulis dari perusahaan.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 sm:py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
          {/* Left Side - Product Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/head.png?height=600&width=500&text=Beautiful+Acrylic+Flower"
                alt="Acrylic Flower"
                width={500}
                height={600}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 bg-white rounded-full p-3 sm:p-4 shadow-lg">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500 fill-current" />
            </div>
          </div>

          {/* Right Side - Hero Text */}
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-4">
              <Badge
                variant="outline"
                className="text-blue-600 border-blue-200 bg-blue-50 text-xs sm:text-sm"
              >
                ✨ Premium Rental Service
              </Badge>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-serif font-bold text-gray-900 leading-tight">
                Sampaikan Perasaan Anda dengan Cara yang{" "}
                <span className="text-blue-600">Paling Indah</span>
              </h1>
              <p className="text-base sm:text-lg xl:text-xl text-gray-600 leading-relaxed">
                Sewa Standing Acrylic Flower & Banner yang Aesthetic, Praktis,
                dan Terjangkau untuk Semua Momen Berharga Anda.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() =>
                  document
                    .getElementById("pricing")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Lihat Pilihan & Harga
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-medium bg-transparent"
                onClick={() =>
                  document
                    .getElementById("gallery")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Lihat Galeri
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-4">
              Koleksi Kami
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Temukan inspirasi dari berbagai desain standing acrylic flower dan
              banner yang telah mempercantik momen-momen berharga klien kami.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {galleryImages.map((image, index) => (
              <Dialog key={image.id}>
                <DialogTrigger asChild>
                  <div
                    className={`relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group ${
                      index % 2 === 0 ? "lg:mt-8" : ""
                    }`}
                  >
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      width={400}
                      height={300}
                      className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white border-white/30 text-xs"
                      >
                        {image.category === "flower"
                          ? "Acrylic Flower"
                          : "Standing Banner"}
                      </Badge>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl mx-4">
                  <VisuallyHidden>
                    <DialogTitle>{image.alt}</DialogTitle>
                  </VisuallyHidden>
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    width={800}
                    height={600}
                    className="w-full h-auto rounded-lg"
                  />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-4">
              Mengapa Gypshophila Boardy?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-4">
              Keunggulan yang membuat kami menjadi pilihan terbaik untuk
              kebutuhan dekorasi Anda.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <Card className="text-center p-6 sm:p-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-gray-900">
                  Desain Modern & Mewah
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Koleksi desain eksklusif yang selalu mengikuti tren terkini
                  dengan sentuhan elegan dan berkelas untuk setiap momen spesial
                  Anda.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 sm:p-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-gray-900">
                  Praktis & Tidak Ribet
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Layanan lengkap dari konsultasi, desain, hingga instalasi.
                  Anda tinggal duduk manis dan menikmati hasil yang sempurna.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 sm:p-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-gray-900">
                  Harga Terjangkau & Transparan
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Tidak ada biaya tersembunyi. Semua harga sudah jelas dan
                  transparan dengan kualitas premium yang tidak menguras
                  kantong.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-4">
              Kata Pelanggan Kami
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-4">
              Kepuasan pelanggan adalah prioritas utama kami
            </p>
          </div>

          {/* Approved Reviews Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto mb-12">
            {reviewsLoading ? (
              // Loading skeleton
              [...Array(4)].map((_, i) => (
                <Card
                  key={i}
                  className="p-4 sm:p-6 border-0 shadow-lg animate-pulse"
                >
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(5)].map((_, j) => (
                        <div
                          key={j}
                          className="w-5 h-5 bg-gray-200 rounded"
                        ></div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="space-y-1">
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : approvedReviews.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  Belum ada review yang disetujui
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Review dari pelanggan akan muncul di sini setelah disetujui
                  admin
                </p>
              </div>
            ) : (
              approvedReviews.map((review) => (
                <Card
                  key={review.id}
                  className="p-4 sm:p-6 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <CardContent className="space-y-4">
                    <StarRating
                      rating={review.rating}
                      size="md"
                      className="mb-3"
                    />
                    <p className="text-sm sm:text-base text-gray-700 italic leading-relaxed">
                      "{review.review}"
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {review.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {review.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {review.service}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">{review.date}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Review Submission Form */}
          <div className="max-w-2xl mx-auto">
            <Card className="p-6 sm:p-8 border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mb-2">
                    Bagikan Pengalaman Anda
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Ceritakan pengalaman Anda menggunakan layanan Gypshophila
                    Boardy
                  </p>
                </div>

                <form className="space-y-4" onSubmit={handleReviewSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Masukkan nama Anda"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email (Opsional)
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating *
                    </label>
                    <div className="space-y-2">
                      <StarRating
                        rating={rating}
                        interactive={true}
                        onRatingChange={setRating}
                        size="lg"
                      />
                      {rating > 0 && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 font-medium">
                            Rating yang dipilih: {rating}/5
                          </span>
                          <StarRating rating={rating} size="sm" />
                        </div>
                      )}
                    </div>
                    {rating === 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        Silakan pilih rating
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Layanan yang Digunakan *
                    </label>
                    <select
                      name="service"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">Pilih layanan</option>
                      <option value="standing-flower">
                        Standing Acrylic Flower
                      </option>
                      <option value="standing-banner">Standing Banner</option>
                      <option value="both">Keduanya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ulasan Anda *
                    </label>
                    <textarea
                      name="review"
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                      placeholder="Ceritakan pengalaman Anda menggunakan layanan kami..."
                    />
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      required
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="consent"
                      className="text-xs sm:text-sm text-gray-600"
                    >
                      Saya setuju bahwa ulasan ini dapat ditampilkan di website
                      dan media sosial Gypshophila Boardy untuk keperluan
                      promosi.
                    </label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || rating === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Mengirim...
                      </>
                    ) : (
                      "Kirim Ulasan"
                    )}
                  </Button>
                </form>

                {submitMessage && (
                  <div
                    className={`text-center p-3 rounded-lg text-sm ${
                      submitMessage.type === "success"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {submitMessage.text}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Review Stats */}
          <div className="text-center mt-8 sm:mt-12">
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8 text-gray-600">
              <div className="flex items-center">
                <StarRating
                  rating={
                    approvedReviews.length > 0
                      ? Math.round(
                          approvedReviews.reduce(
                            (sum, review) => sum + review.rating,
                            0
                          ) / approvedReviews.length
                        )
                      : 5
                  }
                  size="md"
                  className="mr-2"
                />
                <span className="font-semibold">
                  {approvedReviews.length > 0
                    ? `${(
                        approvedReviews.reduce(
                          (sum, review) => sum + review.rating,
                          0
                        ) / approvedReviews.length
                      ).toFixed(1)}/5.0`
                    : "4.8/5.0"}
                </span>
              </div>
              <div className="text-sm">
                Berdasarkan{" "}
                {approvedReviews.length > 0
                  ? `${approvedReviews.length}+`
                  : "50+"}{" "}
                ulasan pelanggan
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-4">
              Daftar Harga & Paket Layanan
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-4">
              Pilih paket yang sesuai dengan kebutuhan dan budget Anda.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="flower" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8 bg-blue-50 p-1 rounded-xl">
                <TabsTrigger
                  value="flower"
                  className="text-sm sm:text-base lg:text-lg font-medium py-2 sm:py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                >
                  Sewa Standing Flower
                </TabsTrigger>
                <TabsTrigger
                  value="banner"
                  className="text-sm sm:text-base lg:text-lg font-medium py-2 sm:py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                >
                  Sewa Standing Banner
                </TabsTrigger>
              </TabsList>

              <TabsContent value="flower">
                <Card className="p-4 sm:p-6 lg:p-8 shadow-lg border-0">
                  <CardContent className="space-y-6">
                    <div className="text-center space-y-4">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-gray-900">
                        Paket Sewa Standing Acrylic Flower
                      </h3>
                      <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                        Cocok untuk menyampaikan berbagai macam perasaan: cinta,
                        kegembiraan, kasih sayang, penghargaan, simpati,
                        romansa, ucapan ulang tahun, dan permintaan maaf.
                      </p>
                    </div>

                    <div className="flex justify-center mt-8">
                      <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 max-w-md">
                        <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 mx-auto mb-4" />
                        <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                          Sewa Standing Flower
                        </h4>
                        <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                          Rp 75.000
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 mb-2">
                          Per 24 Jam
                        </p>
                        <Badge className="bg-blue-100 text-blue-700 text-xs">
                          Harga Terjangkau
                        </Badge>
                      </div>
                    </div>

                    <div className="text-center mt-6">
                      <p className="text-xs sm:text-sm text-gray-500 italic">
                        * Harga belum termasuk ongkos kirim
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="banner">
                <Card className="p-4 sm:p-6 lg:p-8 shadow-lg border-0">
                  <CardContent className="space-y-6">
                    <div className="text-center space-y-4">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-gray-900">
                        Paket Sewa Standing Banner
                      </h3>
                      <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                        Solusi praktis dan profesional untuk kebutuhan promosi,
                        selamat datang, atau informasi di acara Anda.
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8">
                      <div className="text-center p-4 sm:p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                        <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 mx-auto mb-4" />
                        <h4 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-3">
                          Paket Request Desain
                        </h4>
                        <div className="space-y-2 mb-3">
                          <div className="text-sm font-semibold text-blue-600">
                            • Easy: Rp 50.000
                          </div>
                          <div className="text-sm font-semibold text-blue-600">
                            • Medium: Rp 65.000
                          </div>
                          <div className="text-sm font-semibold text-blue-600">
                            • Hard: Rp 80.000
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700 mb-2 text-xs">
                          Lengkap + Free Lakban
                        </Badge>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Banner + Desain + Sewa Alat Standing
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          *Harga menyesuaikan kesulitan request desain
                        </p>
                      </div>

                      <div className="text-center p-4 sm:p-6 bg-green-50 rounded-xl">
                        <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-green-600 mx-auto mb-4" />
                        <h4 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2">
                          Paket Tanpa Desain
                        </h4>
                        <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
                          Rp 30.000
                        </div>
                        <Badge className="bg-green-100 text-green-700 mb-2 text-xs">
                          Free Lakban
                        </Badge>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Banner + Sewa Alat Standing
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Desain dari customer
                        </p>
                      </div>

                      <div className="text-center p-4 sm:p-6 bg-gray-50 rounded-xl sm:col-span-2 lg:col-span-1">
                        <Clock className="w-8 h-8 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-4" />
                        <h4 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-3">
                          Hanya Sewa Alat
                        </h4>
                        <div className="space-y-1 mb-3">
                          <div className="text-lg sm:text-xl font-bold text-gray-600">
                            Rp 10.000 / 8 jam
                          </div>
                          <div className="text-lg sm:text-xl font-bold text-gray-600">
                            Rp 15.000 / 12 jam
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Sewa Alat Standing Saja
                        </p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                      <div className="text-xs sm:text-sm text-gray-700 space-y-1">
                        <p>
                          • Harga untuk per hari (kecuali sewa alat ada waktu
                          khusus)
                        </p>
                        <p>
                          • Banner yang sudah dipesan akan diberikan kepada
                          customer (hanya banner, tidak termasuk alat)
                        </p>
                        <p>
                          • Paket request desain dan paket tanpa desain free
                          tambahan lakban pada banner
                        </p>
                        <p>
                          •{" "}
                          <strong>
                            Opsi pembelian beserta alat standing +Rp 20.000
                            (harga menyesuaikan)
                          </strong>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-4">
              Alur Sewa
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-4">
              Proses mudah dalam 4 langkah sederhana.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg sm:text-2xl font-bold">
                  1
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  Pilih Paket
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Tentukan paket yang sesuai dengan kebutuhan dan budget Anda
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg sm:text-2xl font-bold">
                  2
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  Konsultasi Desain
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Diskusikan konsep dan desain yang Anda inginkan dengan tim
                  kami
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg sm:text-2xl font-bold">
                  3
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  Konfirmasi Jadwal
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Tentukan tanggal dan waktu pengiriman serta penjemputan
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg sm:text-2xl font-bold">
                  4
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  Instalasi & Penjemputan
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Tim kami akan mengantarkan, memasang, dan menjemput sesuai
                  jadwal
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-serif font-bold mb-4 sm:mb-6">
              Siap Membuat Momen Anda Lebih Berkesan?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 px-4">
              Jangan biarkan momen berharga Anda berlalu begitu saja. Hubungi
              kami sekarang untuk konsultasi gratis dan wujudkan acara impian
              Anda!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() =>
                  window.open(
                    "https://wa.me/6282183301667?text=Halo, saya tertarik dengan layanan Gypshophila Boardy",
                    "_blank"
                  )
                }
              >
                <MessageCircle className="mr-2 w-5 h-5 sm:w-6 sm:h-6" />
                <span className="hidden sm:inline">
                  KONSULTASI & PESAN VIA WHATSAPP
                </span>
                <span className="sm:hidden">WHATSAPP</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-medium bg-transparent"
                onClick={() =>
                  window.open(
                    "https://www.instagram.com/gypshophila.boardy/",
                    "_blank"
                  )
                }
              >
                <Instagram className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Instagram
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SOP Penyewaan Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-4">
              SOP Penyewaan
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Standar Operasional Prosedur untuk memastikan proses penyewaan
              berjalan lancar dan transparan.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            {sopItems.map((section, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 mb-4 sm:mb-6">
                    {section.title}
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {section.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex items-start space-x-3"
                      >
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed flex-1">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12 space-y-4">
            <div className="flex flex-col sm:flex-row justify-center sm:space-x-8 space-y-2 sm:space-y-0 text-gray-600 text-sm sm:text-base">
              <div className="flex items-center justify-center">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span>+62 821-8330-1667</span>
              </div>
              <div className="flex items-center justify-center">
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="break-all">gypshophila.boardy</span>
              </div>
              <div className="flex items-center justify-center">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span>Semarang, Indonesia</span>
              </div>
            </div>
            <div className="flex justify-center">
              <a
                href="/admin-login"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 shadow-sm"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Admin Panel
              </a>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              © 2024 Gypshophila Boardy - P2MW Program. All rights reserved.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
