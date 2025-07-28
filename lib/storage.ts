// Server-side file storage utilities (Node.js only)
import fs from "fs";
import path from "path";
import { Review } from "./db";

const REVIEWS_FILE_PATH = path.join(process.cwd(), "data", "reviews.json");

// Default demo reviews
const DEFAULT_REVIEWS: Review[] = [
  {
    id: "1",
    name: "Sarah Amanda",
    email: "sarah@example.com",
    rating: 5,
    service: "standing-flower",
    review:
      "Standing flower yang saya sewa untuk anniversary sangat cantik! Designnya elegant dan sesuai dengan request. Pelayanannya juga ramah dan profesional.",
    status: "approved",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    name: "Rizki Pratama",
    email: "rizki@example.com",
    rating: 5,
    service: "standing-banner",
    review:
      "Terima kasih Gypshophila Boardy! Standing banner untuk grand opening toko saya sangat membantu. Kualitas bagus dan harganya terjangkau.",
    status: "approved",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    name: "Dinda Ayu",
    email: "dinda@example.com",
    rating: 4,
    service: "standing-flower",
    review:
      "Sewa standing flower untuk proposal. Hasilnya memuaskan dan membuat momen jadi lebih berkesan. Recommended banget!",
    status: "approved",
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    name: "Maya Fitri",
    email: "maya@example.com",
    rating: 5,
    service: "standing-banner",
    review:
      "Pelayanan cepat, hasil sesuai ekspektasi. Standing banner untuk event kantor sangat membantu. Tim nya profesional dan responsif.",
    status: "approved",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    name: "Ahmad Fauzi",
    email: "ahmad@example.com",
    rating: 5,
    service: "both",
    review:
      "Paket lengkap untuk event pernikahan adik. Hasilnya sangat memuaskan dan sesuai budget. Terima kasih!",
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export class FileStorage {
  private static instance: FileStorage;
  private initialized = false;

  private constructor() {}

  static getInstance(): FileStorage {
    if (!FileStorage.instance) {
      FileStorage.instance = new FileStorage();
    }
    return FileStorage.instance;
  }

  private async ensureDataDirectory(): Promise<void> {
    const dataDir = path.dirname(REVIEWS_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log("Created data directory:", dataDir);
    }
  }

  private async ensureFileExists(): Promise<void> {
    if (!fs.existsSync(REVIEWS_FILE_PATH)) {
      fs.writeFileSync(
        REVIEWS_FILE_PATH,
        JSON.stringify(DEFAULT_REVIEWS, null, 2)
      );
      console.log("Created reviews file with default data");
    }
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await this.ensureDataDirectory();
      await this.ensureFileExists();
      this.initialized = true;
      console.log("File storage initialized successfully");
    } catch (error) {
      console.error("Error initializing file storage:", error);
      throw error;
    }
  }

  async readReviews(): Promise<Review[]> {
    await this.initialize();

    try {
      const fileContent = fs.readFileSync(REVIEWS_FILE_PATH, "utf-8");
      const reviews = JSON.parse(fileContent) as Review[];
      return reviews;
    } catch (error) {
      console.error("Error reading reviews from file:", error);
      // Return default reviews on error
      return [...DEFAULT_REVIEWS];
    }
  }

  async writeReviews(reviews: Review[]): Promise<void> {
    await this.initialize();

    try {
      fs.writeFileSync(REVIEWS_FILE_PATH, JSON.stringify(reviews, null, 2));
      console.log("Reviews saved to file successfully");
    } catch (error) {
      console.error("Error writing reviews to file:", error);
      throw error;
    }
  }
}

export const fileStorage = FileStorage.getInstance();
