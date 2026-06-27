import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("product_images")
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_id: number;

  @Column()
  image_url: string;

  @Column({ default: 0 })
  sort_order: number;

  @CreateDateColumn()
  created_at: Date;
}
