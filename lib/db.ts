// Database types and interfaces for the review system

export interface Review {
  id: string;
  name: string;
  email?: string;
  rating: number;
  service: string;
  review: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface ReviewSubmission {
  name: string;
  email?: string;
  rating: number;
  service: string;
  review: string;
  consent: boolean;
}

export interface ReviewStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

// Helper functions
export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Helper functions that can be used on both client and server
export function formatTimeAgo(dateString: string): string {
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
}

export function getServiceDisplayName(service: string): string {
  // Handle multiple services (comma-separated)
  if (service.includes(", ")) {
    const services = service.split(", ");
    return services
      .map((s) => {
        switch (s) {
          case "standing-flower":
            return "Standing Acrylic Flower";
          case "standing-banner":
            return "Standing Banner";
          case "bouquet-flowers":
            return "Bouquet Flowers";
          default:
            return s;
        }
      })
      .join(", ");
  }

  // Handle single service (backward compatibility)
  switch (service) {
    case "standing-flower":
      return "Standing Acrylic Flower";
    case "standing-banner":
      return "Standing Banner";
    case "bouquet-flowers":
      return "Bouquet Flowers";
    case "both":
      return "Standing Flower & Banner"; // Keep for backward compatibility
    default:
      return service;
  }
}
