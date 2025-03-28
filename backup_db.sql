PGDMP         ,                }           prueba-tecnica    15.2    15.2                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    20273    prueba-tecnica    DATABASE     �   CREATE DATABASE "prueba-tecnica" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Chile.1252';
     DROP DATABASE "prueba-tecnica";
                postgres    false            �            1259    20307    order_items    TABLE     �   CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer,
    product_id integer,
    quantity integer NOT NULL,
    price integer NOT NULL
);
    DROP TABLE public.order_items;
       public         heap    postgres    false            �            1259    20306    order_items_id_seq    SEQUENCE     �   CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.order_items_id_seq;
       public          postgres    false    219                       0    0    order_items_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;
          public          postgres    false    218            �            1259    20299    orders    TABLE     �   CREATE TABLE public.orders (
    id integer NOT NULL,
    total_amount integer NOT NULL,
    status character varying(50) NOT NULL,
    stripe_session_id character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.orders;
       public         heap    postgres    false            �            1259    20298    orders_id_seq    SEQUENCE     �   CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.orders_id_seq;
       public          postgres    false    217                       0    0    orders_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;
          public          postgres    false    216            �            1259    20290    products    TABLE     �   CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    price integer NOT NULL,
    stock integer NOT NULL
);
    DROP TABLE public.products;
       public         heap    postgres    false            �            1259    20289    products_id_seq    SEQUENCE     �   CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.products_id_seq;
       public          postgres    false    215                       0    0    products_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;
          public          postgres    false    214            r           2604    20310    order_items id    DEFAULT     p   ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);
 =   ALTER TABLE public.order_items ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    218    219            p           2604    20302 	   orders id    DEFAULT     f   ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);
 8   ALTER TABLE public.orders ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    217    217            o           2604    20293    products id    DEFAULT     j   ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);
 :   ALTER TABLE public.products ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    214    215    215                      0    20307    order_items 
   TABLE DATA           P   COPY public.order_items (id, order_id, product_id, quantity, price) FROM stdin;
    public          postgres    false    219   �                 0    20299    orders 
   TABLE DATA           Y   COPY public.orders (id, total_amount, status, stripe_session_id, created_at) FROM stdin;
    public          postgres    false    217   �       
          0    20290    products 
   TABLE DATA           G   COPY public.products (id, name, description, price, stock) FROM stdin;
    public          postgres    false    215   {&                  0    0    order_items_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.order_items_id_seq', 56, true);
          public          postgres    false    218                       0    0    orders_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.orders_id_seq', 32, true);
          public          postgres    false    216                       0    0    products_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.products_id_seq', 7, true);
          public          postgres    false    214            x           2606    20312    order_items order_items_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_pkey;
       public            postgres    false    219            v           2606    20305    orders orders_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
       public            postgres    false    217            t           2606    20297    products products_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public            postgres    false    215            y           2606    20313 %   order_items order_items_order_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);
 O   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_order_id_fkey;
       public          postgres    false    3190    219    217            z           2606    20318 '   order_items order_items_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);
 Q   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_product_id_fkey;
       public          postgres    false    215    219    3188                 x�M�[�!D�q17"�c/��u�*툓t��@Y@7i�|*~�p"��ā���ј���.@N;��S�����A+��N]U��k �{b&�sP�B����� ��ɝ��D�*�*��PS"�2&7t����_ԉ�~�]y�:����*��N�$���9?�����j<�����g�i=R�D}��S;���	zZ0�X�ء�,���R�F{�:zپ��1�A�Z�ZOt����L�q��3��Q���FTb&��D��
첥t�4:�n��WJ�yqrD         �  x��V�Ϊ��֧�hSUT�N����N: �(���<��'�����t�%qe���	" �I�ѹL'�& �'`�D����v�aDx4E��O��������<�ےl���ҋ�+4<����٤�Z��3�$�W���7ӈ�����v��ܔ� ��ɣ���:h���z}��\I+?R���,�+gW>���7�l�&�6~ŻV'�E�آ��õ�W�����B�sg��)3�<���9�	�W�n���'��5/B�\w@�}nIq�m**�l�1��Y�o��E^z�?S�̜��R�:�B���$7��Z3���[~-+�a���%k�[ф�s�XNbI�i�iȺ�~C`�����M�����������V�I_]N��>����J���+٩;�o8l���ԓ�	xn�1�C4�y����	�����ԗ��z
dE�ױ�F�gs�6��
h���JSPd�~Z o*�L2t���]p���e�씝P0F
a�XgW�o�eH��G�qz�z(�J�*��RM���y1�L�Լ@���0�0!S�O8�o��M�js���MeVg��&�����"H=�d���������_(�93��(a��x̄��b Y�r���L�u��/�-�K�����o�K��������닱h�rzd�b�sg ~�����[�&ZGᜁ���P�l�#ڀ����8,��%��θY~���&�C�!�C��P38�����
�l�J�jۗy���<��]9��.��=�!�H�蜋��-e���Q����a�8@(�B<��p�N}U��{����5.�fr8��U�]/ob���e�B���\l�%9��>ل����L&����r��
�h�uf+�	 Ŷ�^�m�}��<n�wEl���B/ZS�v����Kk��=|��x��B�չ߈��)��as��7�Kͮ�0);��vc�\=Ձй���۽����`���aM��g�a����ʻXt9��?�a��#�Eo�Y�����ΎtF*V8(�;�a��e2��{�����r��Sfxw�o�Z`Y��޸�KW�/tQX�7��l�>J�{��m�E��U���a������<��	����p�^5e\�����P�i������yON�/69�2��}�QA�z̊�c:c9��Bv�~C*��6}��U��5��$�3�3K��%���s�.g�5�+�{v�� �g<��O!�@����;��}u;ӵ�]���~�آ�Zg\H�F�4���^����NY4�E�̘�,�M��o�XAz緙�4��SV���)��
W�H�L��0V2��%=�2 ��d�a��W�nA�[��-�mTw���w�R\h�U���C;�^'��)/S2��!.dG{�b��XA��qd?
����i�"�3����9�T�w��[���c�.��%:n�Ea*�]��c_ᑂC����@r�����"��(�w^�H����Ku��U�8v�V��Xh�n�7�VP��x��Cq3��p؋�Y�?@��K��-�7gѯt����E=ۆ�3�@f�M�y}���.�h�Tyi*�-�X6���ǯ���\t0�^�+g�[��]t�W��j��5� ��6��R�N[� N���c��(�0�#tXC�~{�4��gwR���U਩s^q����)��ʳ�F�s㠯ԡ�զ�ż'q8��0���Ǖ��%�+�4R���WX��3o;��2�����߷��X�^�E�z��1��x8C�ߩ�pnb���m�FS��z%�g�c	�5+K8��M�3���9.���vx�0�?*���A������]�#_�deŪ��ĭ�~�m���vu�X^�"΄�q��Ԙ��Ͱp8��1��D�u��h���&|\뢠�:���#+������� m��b��%JDް�q�G��x��)�~����@聴�����+P�r-��������Ơ��*m�ՖEIR���9R���byN��M��� �      
   �  x�UR1r#!��� �
I���Y�r�C_�r2��
�����o� E�.ݏy�ݓ�hf��Vj����#��[�������`�w��|�8��@@�0y�`9p��T��1je�^���k�=:��Y�Zz������/�ÄP���e�K��|[�7�	;�kW�;�8���9�N��.�� +���B/����G_V�����2"�1�J�.��Z��î�^�v�SZ@GiOVre�8r�QT�i8�䲩>��ު{NRq�0�O����=5�2�M��\I��WS}@��I$�k����;��2�rW(�b+������jTf��s�=�C�MMg������/i
�!Yf�#cF��/H̡Ҕh'������K��j�p�_�~$cF3�y���-��     