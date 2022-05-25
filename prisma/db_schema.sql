CREATE TABLE IF NOT EXISTS public."User" (
	id SERIAL,
	first_name text NOT NULL,
	last_name text NOT NULL,
	email text NOT NULL,
	CONSTRAINT "User_pkey" PRIMARY KEY (id)
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON public."User" USING lsm (email HASH);

CREATE TABLE IF NOT EXISTS public."Trade" (
	id SERIAL,
	bid_price numeric(65, 30) NOT NULL,
	symbol text NOT NULL,
	trade_time timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	trade_type text NOT NULL,
	order_quantity int4 NOT NULL,
	user_id SERIAL NOT NULL,
	CONSTRAINT "Trade_pkey" PRIMARY KEY (id),
	CONSTRAINT "Trade_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES public."User"(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE VIEW top_buyers_view AS
  SELECT first_name, last_name, SUM(bid_price * order_quantity) as total_portfolio_value FROM public."Trade" as t
  JOIN public."User" as b ON t.user_id = b.id
  GROUP BY (first_name, last_name) ORDER BY total_portfolio_value DESC;