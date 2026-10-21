# Daemons: events

Reads the events the Kernel saved in the outbox and delivers them to the
listeners, including the AI; marks them delivered; retries failures.

Has its own tests.
