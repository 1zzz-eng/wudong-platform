import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

// ============ 模块二：食——餐饮美食模块 ============

@Entity("restaurants")
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column()
  merchant_id: number;

  @Column({ length: 200 })
  address: string;

  @Column({ length: 50, nullable: true })
  coordinate: string;

  @Column({ length: 100, nullable: true })
  open_time: string;

  @Column({ default: 50 })
  capacity: number;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column()
  main_image: string;

  @Column({ type: "decimal", precision: 3, scale: 1, default: 5.0 })
  rating: number;

  @Column({ default: "active" })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}

@Entity("dishes")
export class Dish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  restaurant_id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column()
  main_image: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ default: false })
  is_signature: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}

@Entity("meal_periods")
export class MealPeriod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  restaurant_id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ default: 30 })
  max_booking: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}

@Entity("meal_reservations")
export class MealReservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  restaurant_id: number;

  @Column()
  user_id: number;

  @Column({ type: "date" })
  booking_date: string;

  @Column()
  period_id: number;

  @Column({ default: 1 })
  people_count: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ type: "text", nullable: true })
  remark: string;

  @Column({ default: "pending" })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}

@Entity("farm_products")
export class FarmProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category_id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ length: 100, nullable: true })
  spec: string;

  @Column({ default: 0 })
  stock: number;

  @Column()
  main_image: string;

  @Column({ length: 100, nullable: true })
  origin: string;

  @Column({ type: "date", nullable: true })
  shelf_life: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ default: "active" })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}
