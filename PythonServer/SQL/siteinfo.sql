--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: siteinfo; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE siteinfo (
    siteid character varying NOT NULL,
    sitename character varying NOT NULL,
    regionid character varying NOT NULL,
    regionname character varying,
    priority double precision NOT NULL,
    address character varying,
    lat double precision,
    lon double precision
);


ALTER TABLE public.siteinfo OWNER TO postgres;

--
-- Data for Name: siteinfo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY siteinfo (siteid, sitename, regionid, regionname, priority, address, lat, lon) FROM stdin;
s00001	SNs00001	1	Paris	1	\N	49.003630000000001	2.5169779999999999
s00002	SNs00002	1	Paris	0.80000000000000004	\N	48.872245999999997	2.3055675999999998
s00003	SNs00003	1	Paris	0.5	\N	48.818346499999997	2.3259040999999998
s00004	SNs00004	1	Paris	1	\N	48.877926199999997	2.2844942000000001
s00005	SNs00005	1	Paris	1	\N	48.889874200000001	2.248481
s00006	SNs00006	1	Paris	1	\N	48.761088000000001	2.3604829999999999
s00007	SNs00007	1	Paris	0.80000000000000004	\N	49.039622700000002	2.1165060000000002
s00008	SNs00008	1	Paris	1	\N	48.815846899999997	2.6174466999999999
s00009	SNs00009	1	Paris	1	\N	48.843103200000002	2.2864458999999999
s00010	SNs00010	1	Paris	1	\N	48.882815600000001	2.1065445
s00011	SNs00011	1	Paris	0.5	\N	48.822840100000001	2.4928697
s00012	SNs00012	1	Paris	0.80000000000000004	\N	48.876220600000003	2.3569700999999998
\.


--
-- PostgreSQL database dump complete
--

