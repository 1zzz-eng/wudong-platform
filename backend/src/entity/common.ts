import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

// ============ 公共实体：订单、购物车、收藏、评价、地址 ============

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30, unique: true })
  order_no: string;

  @Column()
  user_id: number;

  @Column({ length: 50 })
  order_type: string;

  @Column()
  item_id: number;

  @Column({ length: 200, nullable: true })
  item_title: string;

  @Column({ nullable: true })
  item_image: string;

  @Column({ type: "simple-json", nullable: true })
  item_snapshot: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total_amount: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  discount_amount: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  paid_amount: number;

  @Column({ length: 50, default: "pending_pay" })
  status: string;

  @Column({ nullable: true })
  merchant_id: number;

  @Column({ type: "simple-json", nullable: true })
  extra_info: string;

  @Column({ nullable: true })
  paid_at: Date;

  @Column({ nullable: true })
  completed_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}

@Entity("carts")
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ length: 50 })
  item_type: string;

  @Column()
  item_id: number;

  @Column({ nullable: true })
  sku_id: number;

  @Column({ length: 200 })
  item_title: string;

  @Column({ nullable: true })
  item_image: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ default: 1 })
  quantity: number;

  @Column({ default: true })
  is_checked: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}

@Entity("favorites")
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ length: 50 })
  favorite_type: string;

  @Column()
  item_id: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}

@Entity("reviews")
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_id: number;

  @Column()
  user_id: number;

  @Column({ length: 50 })
  review_type: string;

  @Column()
  item_id: number;

  @Column({ type: "decimal", precision: 2, scale: 1 })
  rating: number;

  @Column({ type: "text", nullable: true })
  content: string;

  @Column({ type: "simple-json", nullable: true })
  images: string[];

  @Column({ type: "text", nullable: true })
  follow_up: string;

  @Column({ type: "text", nullable: true })
  reply: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}

@Entity("user_addresses")
export class UserAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 200 })
  address: string;

  @Column({ default: false })
  is_default: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}
