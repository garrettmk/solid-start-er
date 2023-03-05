BEGIN;

SELECT plan(1);

SELECT ok(true, 'test passed');


select * from finish();

rollback;