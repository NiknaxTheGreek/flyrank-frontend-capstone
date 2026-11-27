# A8 — Development verification note

Historical configuration troubleshooting, retained separately from the submission overview.

The first A8 preview inherited an older default OMDB_API_KEY. A7 had a corrected branch-specific override, so both nonexistent titles and Arrival returned the generic unavailable error on A8. The corrected key was made the active Preview default and A8 was redeployed. The old default remains scoped to the existing backup branch; A7 continues to resolve the corrected default. No key value was read, printed or committed. Live checks on the corrected deployment verified Arrival and the explicit no-match response.
