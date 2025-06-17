import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Database {
  public: {
    Tables: {
      attendance: {
        Row: {
          id: number
          name: string
          role: string
          date: string
          check_in: string | null
          check_out: string | null
          status: "Present" | "Absent" | "Half Day" | "Late"
          hours: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          role: string
          date: string
          check_in?: string | null
          check_out?: string | null
          status: "Present" | "Absent" | "Half Day" | "Late"
          hours: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          role?: string
          date?: string
          check_in?: string | null
          check_out?: string | null
          status?: "Present" | "Absent" | "Half Day" | "Late"
          hours?: string
          created_at?: string
          updated_at?: string
        }
      }
      inventory: {
        Row: {
          id: number
          name: string
          category: string
          quantity: number
          min_stock: number
          unit: string
          status: string
          last_updated: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          category: string
          quantity: number
          min_stock: number
          unit: string
          status: string
          last_updated?: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          category?: string
          quantity?: number
          min_stock?: number
          unit?: string
          status?: string
          last_updated?: string
          created_at?: string
        }
      }
      inventory_history: {
        Row: {
          id: number
          inventory_id: number
          action: "added" | "removed" | "updated"
          quantity: number
          previous_quantity: number | null
          reason: string
          updated_by: string
          created_at: string
        }
        Insert: {
          id?: number
          inventory_id: number
          action: "added" | "removed" | "updated"
          quantity: number
          previous_quantity?: number | null
          reason: string
          updated_by: string
          created_at?: string
        }
        Update: {
          id?: number
          inventory_id?: number
          action?: "added" | "removed" | "updated"
          quantity?: number
          previous_quantity?: number | null
          reason?: string
          updated_by?: string
          created_at?: string
        }
      }
    }
  }
}
