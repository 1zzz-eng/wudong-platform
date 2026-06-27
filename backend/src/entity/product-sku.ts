import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("product_skus")
export class ProductSku {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_id: number;

  @Column({ length: 100 })
  spec_name: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}
