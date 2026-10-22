# Kernel: outbox

Writes the event in the same transaction as the change, in the envelope of
[contracts/events](../../contracts/events/README.md). The [Daemons](../../daemons/events/README.md) deliver it.

Has its own tests.
