CREATE TABLE profolio(
	id BIGSERIAL NOT NULL PRIMARY KEY,
	owner_email VARCHAR(50) NOT NULL,
	asset_name VARCHAR(50) NOT NULL,
	quantity DOUBLE PRECISION NOT NULL,
	purchase_price MONEY NOT NULL,
	iscrypto BOOLEAN NOT NULL
);

INSERT INTO profolio(id, owner_email, asset_name, quantity, purchase_price, iscrypto) VALUES (1, 'johndoe@gmail.com', 'btc', 0.5, 50000.00, TRUE);
INSERT INTO profolio(id, owner_email, asset_name, quantity, purchase_price, iscrypto) VALUES (2, 'johndoe@gmail.com', 'cash', 10000, 1.00, FALSE);

