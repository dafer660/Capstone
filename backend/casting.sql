--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;



--
-- Name: actors; Type: TABLE; Schema: public;
--

CREATE TABLE public.actors
(
    id        integer NOT NULL,
    name      character varying,
    age       integer,
    gender    character varying,
    joined_in date,
    agent_id  integer
);


--
-- Name: actors_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public.actors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: actors_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.actors_id_seq OWNED BY public.actors.id;


--
-- Name: agents; Type: TABLE; Schema: public;
--

CREATE TABLE public.agents
(
    id        integer NOT NULL,
    name      character varying,
    joined_in date
);


--
-- Name: agents_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public.agents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: agents_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.agents_id_seq OWNED BY public.agents.id;


--
-- Name: category; Type: TABLE; Schema: public;
--

CREATE TABLE public.category
(
    id   integer NOT NULL,
    name character varying
);

--
-- Name: category_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public.category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: category_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.category_id_seq OWNED BY public.category.id;


--
-- Name: movies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movies
(
    id           integer NOT NULL,
    title        character varying,
    release_date date,
    rating       integer
);

--
-- Name: movies_actors; Type: TABLE; Schema: public;
--

CREATE TABLE public.movies_actors
(
    id       integer NOT NULL,
    movie_id integer,
    actor_id integer
);

--
-- Name: movies_actors_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public.movies_actors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.movies_actors_id_seq
    OWNER TO postgres;

--
-- Name: movies_actors_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.movies_actors_id_seq OWNED BY public.movies_actors.id;


--
-- Name: movies_categories; Type: TABLE; Schema: public;
--

CREATE TABLE public.movies_categories
(
    id          integer NOT NULL,
    movie_id    integer,
    category_id integer
);

--
-- Name: movies_categories_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public.movies_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: movies_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.movies_categories_id_seq OWNED BY public.movies_categories.id;


--
-- Name: movies_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public.movies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: movies_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.movies_id_seq OWNED BY public.movies.id;


--
-- Name: actors id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY public.actors
    ALTER COLUMN id SET DEFAULT nextval('public.actors_id_seq'::regclass);


--
-- Name: agents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agents
    ALTER COLUMN id SET DEFAULT nextval('public.agents_id_seq'::regclass);


--
-- Name: category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ALTER COLUMN id SET DEFAULT nextval('public.category_id_seq'::regclass);


--
-- Name: movies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ALTER COLUMN id SET DEFAULT nextval('public.movies_id_seq'::regclass);


--
-- Name: movies_actors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies_actors
    ALTER COLUMN id SET DEFAULT nextval('public.movies_actors_id_seq'::regclass);


--
-- Name: movies_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies_categories
    ALTER COLUMN id SET DEFAULT nextval('public.movies_categories_id_seq'::regclass);

--
-- Data for Name: agents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.agents (id, name, joined_in) FROM stdin;
1	Susan Percival	2019-05-01
2	Harry Lee	2019-05-01
\.

--
-- Data for Name: actors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.actors (id, name, age, gender, joined_in, agent_id) FROM stdin;
1	Charlie Tuff	30	Male	2019-05-01	1
2	Ana Torres	27	Female	2019-05-01	2
\.

--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category (id, name) FROM stdin;
1	drama
2	comedy
3	action
4	thriller
5	horror
\.


--
-- Name: actors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.actors_id_seq', 3, true);


--
-- Name: agents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.agents_id_seq', 2, true);


--
-- Name: category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.category_id_seq', 5, true);


--
-- Name: movies_actors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movies_actors_id_seq', 1, false);


--
-- Name: movies_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movies_categories_id_seq', 1, false);


--
-- Name: movies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movies_id_seq', 1, false);


--
-- Name: actors actors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actors
    ADD CONSTRAINT actors_pkey PRIMARY KEY (id);


--
-- Name: agents agents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agents
    ADD CONSTRAINT agents_pkey PRIMARY KEY (id);


--
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


--
-- Name: movies_actors movies_actors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies_actors
    ADD CONSTRAINT movies_actors_pkey PRIMARY KEY (id);


--
-- Name: movies_categories movies_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies_categories
    ADD CONSTRAINT movies_categories_pkey PRIMARY KEY (id);


--
-- Name: movies movies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (id);


--
-- Name: actors actors_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.actors
    ADD CONSTRAINT actors_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents (id) ON DELETE CASCADE;


--
-- Name: movies_actors movies_actors_actor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies_actors
    ADD CONSTRAINT movies_actors_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES public.actors (id) ON DELETE CASCADE;


--
-- Name: movies_actors movies_actors_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies_actors
    ADD CONSTRAINT movies_actors_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies (id) ON DELETE CASCADE;


--
-- Name: movies_categories movies_categories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies_categories
    ADD CONSTRAINT movies_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category (id) ON DELETE CASCADE;


--
-- Name: movies_categories movies_categories_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies_categories
    ADD CONSTRAINT movies_categories_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies (id) ON DELETE CASCADE;

--
-- PostgreSQL database dump complete
--

