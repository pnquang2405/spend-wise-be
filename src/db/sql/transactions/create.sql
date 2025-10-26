INSERT INTO transactions (
    user_id,
    category_id,
    amount,
    type,
    description,
    transaction_date,
    meta
  )
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;