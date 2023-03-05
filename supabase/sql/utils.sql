-- Active: 1677982949012@@127.0.0.1@54322@postgres
CREATE OR REPLACE FUNCTION get_initials(name TEXT) RETURNS TEXT
AS $$
  DECLARE
      initials TEXT := '';
      word TEXT := '';
  BEGIN
      FOR word IN (SELECT regexp_split_to_table(name, E'\\s+') LIMIT 2) LOOP
          initials := initials || upper(substring(word, 1, 1));
      END LOOP;
      RETURN initials;
  END;
$$ LANGUAGE plpgsql;
