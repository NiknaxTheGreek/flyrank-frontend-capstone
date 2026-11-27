# A8 — Screenshot evidence inventory

The original screenshots document the hosted resilience checkpoint on 19 November 2026. They are organized around a successful interaction, failure, recovery and mobile usability rather than prescribed film titles. The 27 November audit inspected all 12 supplied images and verified the nine selected originals against their Git blob hashes.

| Evidence | Original upload | What it demonstrates |
|---|---|---|
| [Happy path](screenshots/01-happy-path.png) | `image(20261119-155441).png` | A completed comedy recommendation appears in the conversation, with the input and action controls available. Two identical user messages are visible; this capture is not evidence of duplicate-click prevention. |
| [Offline before send](screenshots/02-offline-error.png) | `image(20261119-155900).png` | Chrome Network is set to Offline. A failed request displays a designed error, reassurance that earlier messages are safe, and Retry failed message. |
| [Network restored](screenshots/03-offline-recovery.png) | `image(20261119-160035).png` | The earlier failed action-movie request has a completed recommendation after connectivity is restored. The Network panel retains earlier failed requests. |
| [Interrupted response](screenshots/04-interrupted-stream.png) | `image(20261119-160734).png` | Partial recommendations remain visible, with an Interrupted label, an error panel and Retry failed message. Offline is selected; the provider error wording does not identify the precise upstream cause. |
| [Recovery after interruption](screenshots/05-stream-recovery.png) | `image(20261119-161330).png` | A longer recommendation completes after the documented retry; the Network panel shows the successful request alongside prior failures. |
| [Happy-path console](screenshots/06-clean-console.png) | `image(20261119-181933).png` | A completed recommendation alongside the visible, empty DevTools Console. This supports the recorded clean-console check for that request, not all possible requests. |
| [No matching movie](screenshots/07-no-matching-movie.png) | `image(20261119-183216).png` | The corrected deployment returns a designed no-match tool card, with guidance and Retry failed message. |
| [Successful lookup](screenshots/08-arrival-card.png) | `image(20261119-183241).png` | A structured movie card includes rating, genre, runtime, plot and an IMDb link on the corrected deployment. |
| [Android mobile](screenshots/09-android-mobile.jpg) | `01-1000160253.jpg` | Real phone screenshot shows a readable recommendation, wrapped chat content, Jump to latest and the start of the composer. Reachability of the remaining controls and keyboard behavior were learner-confirmed separately. |

## Selection and provenance

The other three supplied PNGs are not included in the primary submission set:

| Original filename | Reason |
|---|---|
| `image(20261119-182109).png` | Repeats the completed recommendation with DevTools Elements open; the Console capture is more directly relevant. |
| `image(20261119-182715).png` | Earlier generic lookup-unavailable error before the documented OMDb configuration correction. |
| `image(20261119-182822).png` | Earlier generic unavailable error for a valid title before the configuration correction. |

The earlier configuration errors are useful backup evidence, but the corrected no-match and successful lookup captures better represent the final checkpoint. The original files in [screenshots/](screenshots/) have unchanged bytes; the older [cropped review copies](evidence/) are retained for compatibility and are not the primary submission set. The phone capture does not show the whole keyboard interaction; additional Android behavior was learner-confirmed in the original verification session. Safari/mobile Safari was not tested.
