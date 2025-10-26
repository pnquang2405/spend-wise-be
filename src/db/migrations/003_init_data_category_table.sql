INSERT INTO categories (name, type)
VALUES ('Ăn uống', 'expense'),
  ('Mua sắm', 'expense'),
  ('Tiền nhà', 'expense'),
  ('Giải trí', 'expense'),
  ('Hóa đơn', 'expense'),
  ('Sức khỏe', 'expense'),
  ('Giáo dục', 'expense'),
  ('Quà tặng', 'expense'),
  ('Thể thao', 'expense'),
  ('Thú cưng', 'expense'),
  ('Du lịch', 'expense'),
  ('Khác', 'expense') ON CONFLICT DO NOTHING;