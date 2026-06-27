import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 200, nullable: true })
  subtitle: string;

  @Column()
  category_id: number;

  @Column()
  merchant_id: number;

  @Column()
  main_image: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  market_price: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: 0 })
  sales_count: number;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "text", nullable: true })
  craft_intro: string;

  @Column({ nullable: true })
  inheritor_name: string;

  @Column({ default: "active" })
  status: string;

  @Column({ type: "decimal", precision: 3, scale: 1, default: 5.0 })
  rating: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}
