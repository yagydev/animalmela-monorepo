# Entity relationship (from Prisma schema)

High-level model: **User** (buyer/seller/admin) owns **Address** and **Cart**; **SellerProfile** + **Store** own **Product**; **Order** snapshots address and line items per **Store**; **Reviews**, **Chat**, **AgriEvent**, and **CommissionLedger** support marketplace operations.

```mermaid
erDiagram
  User ||--o{ Address : has
  User ||--o| Cart : has
  User ||--o{ Order : places
  User ||--o| SellerProfile : may_have
  User ||--o{ ProductReview : writes
  User ||--o{ SellerReview : writes
  User ||--o{ ChatThread : buyer
  User ||--o{ ChatMessage : sends

  SellerProfile ||--o| Store : owns
  Store ||--o{ Product : lists
  Store ||--o{ OrderItem : fulfills
  Store ||--o{ ChatThread : receives
  Store ||--o{ SellerReview : rated
  Store ||--o{ CommissionLedger : earns

  Category ||--o{ Category : parent_child
  Category ||--o{ Product : classifies

  Product ||--o{ ProductImage : has
  Product ||--o{ CartItem : in
  Product ||--o{ OrderItem : sold_as
  Product ||--o{ ProductReview : reviewed

  Cart ||--o{ CartItem : contains

  Order ||--o{ OrderItem : lines
  Order ||--o{ CommissionLedger : platform_fee
  Order }o--|| Address : ships_to

  ChatThread ||--o{ ChatMessage : contains
```

Enums (status fields): `Role`, `SellerKycStatus`, `ProductStatus`, `OrderStatus`, `PaymentStatus`.
