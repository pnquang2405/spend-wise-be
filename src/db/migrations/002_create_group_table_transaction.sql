CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(10) CHECK (type IN ('income', 'expense')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_categories_user ON categories(user_id);
CREATE TABLE transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  category_id BIGINT REFERENCES categories(id) ON DELETE
  SET NULL,
    amount NUMERIC(14, 2) NOT NULL CHECK (amount >= 0),
    type VARCHAR(10) CHECK (type IN ('income', 'expense')),
    description TEXT,
    transaction_date TIMESTAMPTZ DEFAULT NOW(),
    meta JSONB DEFAULT '{}'::JSONB,
    -- linh hoạt cho dữ liệu mở rộng
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_transactions_user_date ON transactions (user_id, transaction_date DESC);
CREATE TABLE groups (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_by BIGINT REFERENCES users(id) ON DELETE
  SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_groups_created_by ON groups(created_by);
CREATE TABLE group_members (
  id BIGSERIAL PRIMARY KEY,
  group_id BIGINT REFERENCES groups(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (group_id, user_id)
);
CREATE INDEX idx_group_members_user ON group_members(user_id);
CREATE INDEX idx_group_members_group ON group_members(group_id);
CREATE TABLE group_expenses (
  id BIGSERIAL PRIMARY KEY,
  group_id BIGINT REFERENCES groups(id) ON DELETE CASCADE,
  paid_by BIGINT REFERENCES users(id) ON DELETE
  SET NULL,
    description TEXT,
    total_amount NUMERIC(14, 2) NOT NULL CHECK (total_amount >= 0),
    expense_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    meta JSONB DEFAULT '{}'::JSONB -- thêm mô tả, ảnh hóa đơn, vị trí,...
);
CREATE INDEX idx_group_expenses_group_date ON group_expenses(group_id, expense_date DESC);
CREATE INDEX idx_group_expenses_paid_by ON group_expenses(paid_by);
CREATE TABLE group_expense_splits (
  id BIGSERIAL PRIMARY KEY,
  expense_id BIGINT REFERENCES group_expenses(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  amount_owed NUMERIC(14, 2) NOT NULL CHECK (amount_owed >= 0),
  settled BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::JSONB,
  -- ví dụ: {"note": "trả bằng tiền mặt"}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (expense_id, user_id)
);
CREATE INDEX idx_group_expense_splits_user ON group_expense_splits(user_id);
CREATE INDEX idx_group_expense_splits_expense ON group_expense_splits(expense_id);
CREATE TABLE settlements (
  id BIGSERIAL PRIMARY KEY,
  group_id BIGINT REFERENCES groups(id) ON DELETE CASCADE,
  from_user BIGINT REFERENCES users(id) ON DELETE
  SET NULL,
    to_user BIGINT REFERENCES users(id) ON DELETE
  SET NULL,
    amount NUMERIC(14, 2) NOT NULL CHECK (amount >= 0),
    settled_at TIMESTAMPTZ DEFAULT NOW(),
    note TEXT
);
CREATE INDEX idx_settlements_group ON settlements(group_id);
CREATE INDEX idx_settlements_from_to ON settlements(from_user, to_user);