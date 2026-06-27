import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";

// ============ 模块一：衣——非遗商品模块 ============

@Entity("product_categories")
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ default: 0 })
  sort_order: number;

  @Column({ nullable: true })
  parent_id: number;

  @Column({ default: "active" })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}
