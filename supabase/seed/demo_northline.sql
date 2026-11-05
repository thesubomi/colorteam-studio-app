-- Demo client for testing and sales demos: Northline Summit (fictional event brand).
-- Rerunnable: deleting the workspace cascades to its files, members and requests, so this also resets the demo.
-- Staging only.

delete from public.workspaces where slug = 'northline';

with ws as (
  insert into public.workspaces (slug, name, plan, settings) values ('northline', 'Northline Summit (demo)', 'growth', jsonb_build_object(
    'kit', jsonb_build_object(
      'colors', jsonb_build_array(
        jsonb_build_object('name','Forest','hex','#0B3B2E','role','ground'),
        jsonb_build_object('name','Paper','hex','#F4F1EA','role','surface'),
        jsonb_build_object('name','White','hex','#FFFFFF','role','ink'),
        jsonb_build_object('name','Signal','hex','#9BE37A','role','accent'),
        jsonb_build_object('name','Moss','hex','#A9C2B5','role','muted')),
      'fonts', jsonb_build_object('display','Inter','body','Inter','serif','Newsreader'),
      'logos', jsonb_build_array(),
      'imagery', 'Real people on stage and in the hallway, shot wide. Green duotone for speakers, never stock handshakes.',
      'voice', 'Plain, specific, a bit dry. Talk about what worked last quarter, not the future of anything. Numbers over adjectives.',
      'dont', 'No gradients. No rocket emoji. Never call it a "journey".',
      'banned', 'journey, synergy, game-changer, revolutionary',
      'locks', jsonb_build_object('layout', true),
      'updatedAt', now(), 'updatedBy', 'Colorteam'),
    'foundation', jsonb_build_object(
      'moodboards', jsonb_build_object('status','done','note','Direction B chosen: forest and signal green, editorial type.','files', jsonb_build_array()),
      'logo',       jsonb_build_object('status','done','note','Wordmark refined; social mini mark delivered.','files', jsonb_build_array()),
      'guidelines', jsonb_build_object('status','in progress','note','Content guidelines in layout, due Friday.','files', jsonb_build_array()),
      'signoff',    jsonb_build_object('status','not started','files', jsonb_build_array()))
  )) returning id
), mem as (
  insert into public.memberships (workspace_id, email, name, role)
  select id, x.email, x.name, x.role from ws, (values
    ('subomi@colorteam.io','Subomi','owner'),
    ('demo.editor@northline.test','Ada (editor)','editor'),
    ('demo.approver@northline.test','Tomasz (approver)','approver')) as x(email,name,role)
  returning 1
), files as (
  insert into public.requests (workspace_id, uid, email, status, comment, at, data)
  select ws.id, '00000000-0000-0000-0000-0000000000de'::uuid, x.email, x.status, x.comment, now() - x.ago,
         jsonb_build_object('title', x.title, 'tplId', x.tpl, 'fields', x.fields, 'sizes', x.sizes, 'theme', x.theme,
                            'ownerName', x.owner, 'updatedAt', now() - x.ago, 'updatedBy', x.owner, 'schedule', x.sched)
  from ws, (values
    ('Early bird is open','announcement','demo.editor@northline.test','Ada (editor)','approved','', interval '3 days',
       '{"label":"Tickets","title":"Early bird is *open*","body":"2,000 founders, operators and investors in Warsaw, 14 to 15 May. 149 EUR until Friday.","cta":"northline.events"}'::jsonb,
       '["post","story"]'::jsonb, 0, to_char(now() + interval '1 day','YYYY-MM-DD')),
    ('Speaker: Clara on pricing','photo-quote','demo.editor@northline.test','Ada (editor)','pending','', interval '5 hours',
       '{"quote":"Raise prices *before* you feel ready. Every time.","name":"Clara Moreau","role":"Founder, Pricewise"}'::jsonb,
       '["post"]'::jsonb, 1, to_char(now() + interval '3 days','YYYY-MM-DD')),
    ('Agenda drop','announcement','demo.editor@northline.test','Ada (editor)','changes','Swap "journey" for something concrete, and add the date.', interval '1 day',
       '{"label":"Agenda","title":"The full *journey* is live","body":"48 talks, 2 stages, 1 afterparty.","cta":"northline.events/agenda"}'::jsonb,
       '["post","square"]'::jsonb, 0, to_char(now() + interval '6 days','YYYY-MM-DD')),
    ('Volunteers wanted','announcement','demo.editor@northline.test','Ada (editor)','draft','', interval '20 minutes',
       '{"label":"Join us","title":"We need *40* volunteers","body":"Two days, free ticket, the best hallway track in Warsaw.","cta":"northline.events/volunteer"}'::jsonb,
       '["story"]'::jsonb, 2, null)
  ) as x(title,tpl,email,owner,status,comment,ago,fields,sizes,theme,sched)
  returning 1
)
insert into public.template_requests (workspace_id, requested_by, title, brief, status, reply)
select id, 'demo.editor@northline.test', 'Speaker countdown story', 'A 9:16 "3 days to go" story with the speaker photo and a big number.', 'in progress', 'On it. First version tomorrow.'
from ws;

select 'Northline demo ready' as result;
