import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

// ============ 模块三：住——住宿预订模块 ============

@Entity("hotels")
export class Hotel {
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

  @Column({ length: 200, nullable: true })
  style_tags: string;

  @Column({ length: 200, nullable: true })
  facility_tags: string;

  @Column()
  main_image: string;

  @Column({ type: "text", nullable: true })
  description: string;

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

@Entity("room_types")
export class RoomType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hotel_id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50, nullable: true })
  bed_type: string;

  @Column({ type: "decimal", precision: 5, scale: 1, nullable: true })
  area: number;

  @Column({ default: 2 })
  capacity: number;

  @Column({ length: 200, nullable: true })
  facilities: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ default: 5 })
  total_rooms: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}

@Entity("room_calendars")
export class RoomCalendar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  room_type_id: number;

  @Column({ type: "date" })
  date: string;

  @Column({ default: 5 })
  available_count: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ default: "available" })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}
