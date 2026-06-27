import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

// ============ 模块四：行——线路订票模块 ============

@Entity("scenic_spots")
export class ScenicSpot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 200, nullable: true })
  address: string;

  @Column({ length: 50, nullable: true })
  coordinate: string;

  @Column({ length: 100, nullable: true })
  open_time: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column()
  main_image: string;

  @Column({ default: "active" })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}

@Entity("ticket_types")
export class TicketType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  scenic_spot_id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ default: 100 })
  stock: number;

  @Column({ default: 1 })
  valid_days: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}

@Entity("tour_routes")
export class TourRoute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ default: 1 })
  duration_days: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ type: "text", nullable: true })
  includes: string;

  @Column({ length: 100, nullable: true })
  departure: string;

  @Column({ length: 100, nullable: true })
  destination: string;

  @Column({ type: "text", nullable: true })
  notice: string;

  @Column()
  main_image: string;

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

@Entity("route_itineraries")
export class RouteItinerary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  route_id: number;

  @Column({ default: 1 })
  day_number: number;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "text", nullable: true })
  scenic_spots: string;

  @Column({ type: "text", nullable: true })
  meals: string;

  @Column({ type: "text", nullable: true })
  hotel: string;

  @Column({ type: "text", nullable: true })
  transport: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}

@Entity("e_tickets")
export class ETicket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_id: number;

  @Column()
  item_id: number;

  @Column({ length: 50 })
  item_type: string;

  @Column({ unique: true })
  ticket_code: string;

  @Column({ type: "date" })
  valid_date: string;

  @Column({ default: "unused" })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_deleted: boolean;
}
