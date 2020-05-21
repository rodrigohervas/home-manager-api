TRUNCATE types RESTART IDENTITY CASCADE;
TRUNCATE users RESTART IDENTITY CASCADE;
TRUNCATE expenses RESTART IDENTITY CASCADE;
TRUNCATE addresses RESTART IDENTITY CASCADE;
TRUNCATE serviceproviders RESTART IDENTITY CASCADE;

INSERT INTO types (name, description)
VALUES
  ('Water', 'Water utility service providers'), 
  ('Gas', 'Gas utility service providers'), 
  ('Electric', 'Power utility service providers'), 
  ('Groceries', 'Groceries service providers'), 
  ('Insurance', 'Insurance service providers'), 
  ('HVAC/Heat Pump', 'Cooling and Heating service providers'), 
  ('Plumbing', 'Plumbing service providers'), 
  ('Landscaping', 'Landscaping service providers'), 
  ('Extraordinary', 'Extraordinary expenses, in value or type, service providers'), 
  ('Other', 'Expense types or service providers that cannot be catalogued in the previous types');


INSERT INTO users (username, password)
VALUES
  ('michael@jones.com', '$2b$10$s/9a9ktziiL7CptxBXomMuG7z27nXC0UBrNYYlkE1aQzd9QNEmfyW'), --password: michael
  ('mary@jones.com', '$2b$10$.VAA.Ljyex1pu8fPnAu31OfYbhfCp.SpDHIkPb91HUc03LQALYIx.'), --password: mary
  ('paul@jones.com', '$2b$10$HCbyQB3bcONO7UqkyFQNh.3jSK.CCOeF8iGJ1FFBeMgyse6mW.YxC'); --password: paul



INSERT INTO expenses (user_id, type_id, amount, name, description, date)
VALUES
    ( 1, 1,  130.00, 'Monthly Water Utility', 'water expense. It''s a periodic expense for utilities.', '05/01/2020'), 
    ( 1, 3,  178.32, 'Monthly Electric Utility Expense', 'electric expense. It''s a periodic expense for utilities.', '05/04/2020'), 
    ( 1, 2,  200.00, 'Monthly Gas Utility', 'Gas expense. It''s a periodic expense for utilities.', '05/02/2020'), 
    ( 1, 7,  100.00, 'Lawn Mowing April', 'lawn mowing once a week', '05/10/2020'), 
    ( 1, 10, 99.99, 'HVAC Tune Up', 'yearly HVAC Tune up', '05/09/2020'), 
    ( 1, 5,  180.00, 'groceries shopping', 'groceries shopping at Taska store. Weekly groceries.', '05/08/2020'), 
    ( 1, 5,  195.00, 'groceries shopping', 'groceries shopping at Jesperds store. Weekly groceries.', '05/15/2020'), 
    ( 1, 5,  235.00, 'groceries shopping', 'groceries shopping at BuyCheap store. Weekly groceries.', '05/22/2020'), 
    ( 1, 5,  280.00, 'groceries shopping', 'groceries shopping at SuperBuy store. Weekly groceries.', '05/29/2020'), 
    ( 1, 3,  180.50, 'Monthly Electric Utility Expense', 'electric expense. It''s a periodic expense for utilities.', '04/04/2020'),     
    ( 1, 1,  150.00, 'Monthly Water Utility Monthly Water Utility', 'water expense. It''s a periodic expense for utilities.', '04/01/2020'), 
    ( 1, 3,  160.00, 'Monthly Electric Utility Expense', 'electric expense. It''s a periodic expense for utilities.', '06/04/2020'), 
    ( 1, 1,  125.00, 'Monthly Water Utility Monthly Water Utility', 'water expense. It''s a periodic expense for utilities.', '06/01/2020');


INSERT INTO addresses (street, city, state, zipcode)
VALUES
  ('Ap #479-8906 Magnis Street', 'San Miguel', 'VA', 'V2A 4H0'), 
  ('Ap #621-6141 Non, St.', 'Juneau', 'MD', '65987-48807'), 
  ('3091 Sem Ave', 'Taupo', 'MD', '70607'), 
  ( 'P.O. Box 741, 2975 Quis St.', 'Vienna', 'VA', '531674'), 
  ( '3092 Pede Avenue', 'Washington', 'DC', '08640'), 
  ( 'Ap #810-701 Eget Street', 'Washington', 'DC', '197532'), 
  ( '398-5260 Odio Road', 'Freiburg', 'VA', '1315'), 
  ( '8054 Mi Ave', 'Chesapeake', 'MD', 'U36 2OU'), 
  ( 'P.O. Box 866, 2196 Duis Road', 'Fort Worth', 'MD', '109901'),
  ( 'Ap #266-3390 Per Avenue', 'Muzaffargarh', 'VA', 'Z1895');


INSERT INTO serviceproviders (user_id, type_id, name, description, telephone, email, address_id) 
VALUES
    (1, 4, 'Nunc Incorporated', 'mauris id sapien. Cras dolor dolor, tempus non, lacinia at.', '669624543', 'consectetuer@sitamet.org', 1),
    (1, 3, 'Massa Industries', 'Nam tempor diam dictum sapien. Aenean massa. Integer vitae nibh.', '471-657-7437', 'tristique.senectus.et@dolorelitpellentesque.org', 2), 
    (1, 3, 'Maecenas Mi Company', 'Nullam suscipit, est ac facilisis facilisis, magna tellus faucibus leo,', '(731) 941-8164', 'Suspendisse@pharetranibhAliquam.co.uk', 3), 
    (1, 8, 'Proin Ultrices Ltd', 'sem magna nec quam. Curabitur vel lectus. Cum sociis natoque', '797659695', 'iaculis@urna.edu', 4), 
    (1, 10, 'Dolor Elit Pellentesque Incorporated', 'pretium aliquet, metus urna convallis erat, eget tincidunt dui augue', '295-163-4820', 'bibendum.fermentum@velsapien.co.uk', 5), 
    (1, 9, 'Nulla Inc.', 'nec ante. Maecenas mi felis, adipiscing fringilla, porttitor vulputate, posuere', '(940) 360-2491', 'Donec@sedpedeCum.ca', 6), 
    (1, 7, 'Non Vestibulum Nec Foundation', 'amet nulla. Donec non justo. Proin non massa non ante', '(895) 403-6921', 'mi.fringilla.mi@faucibus.edu', 7), 
    (1, 5, 'Kloster Supermarket', 'et nunc. Quisque ornare tortor at risus. Nunc ac sem', '861852594', 'ac.facilisis@nislelementumpurus.co.uk', 8), 
    (1, 5, 'Spanish Delicatessen Fine Foods LLC', 'Sed eu nibh vulputate mauris sagittis placerat. Cras dictum ultricies', '503399561', 'accumsan.convallis@felis.net', 9), 
    (1, 3, 'Mauris Quis LLC', 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur', '(203) 277-2630', 'sit.amet@enim.edu', 10);


      --execute: psql -U [dbAdmin] -d [dbName] -f ./seeds/seed.homemanager_all_tables.sql
    