# 📦 Mailspring Toolbox

Mailspring Toolbox is a productivity plugin for Mailspring that bundles small, focused enhancements.
Instead of many single-purpose plugins, Toolbox acts as a feature collection that can grow over time,
with each feature independently toggleable.

## Installation

- Clone the repository
- Build the plugin (or use pre-built version)
- Link or copy it into your Mailspring plugins directory
- Restart Mailspring

## Current features

### ✉️ Inbox Sorting - Unread First & Starred / Flagged First (Gmail-style)

Custom sort orders for your Inbox:
- **Unread first**: Shows unread threads first.
- **Starred / Flagged first**: Shows starred (flagged) threads first.
- Both can be enabled together to prioritize starred items, followed by unread items, and then chronological order.
- Sorting applies only to Inbox and does not affect Sent, Trash, or Spam.

#### Enabling / disabling

Controlled via a toolbar dropdown in the sidebar toolbar:
- Click the toolbar dropdown button to open the sort checklist.
- Toggle **Unread first** or **Starred / Flagged first** independently.
- Choose **Default order** to revert back to standard chronological sorting.

## Development

To get started, run `npm install` and then `npm run-script build`
to compile the `src` folder into the `lib` folder.

To see the changes in Mailspring, quit and relaunch the app
or open the Developer menu and use Reload menu item.

## ☕ Support

Enjoying this plugin?  

<a href="https://www.buymeacoffee.com/alexey.anufriev" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
