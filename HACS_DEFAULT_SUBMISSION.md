# HACS Default Submission Prep

TideWise is a Home Assistant dashboard/custom card. In HACS internals and in the `hacs/default` repository, dashboard cards are submitted under the `plugin` category.

## Target Repository

```text
https://github.com/TheWillMiller/tide-wise
```

## Default-List Entry

The current `hacs/default` `plugin` file is a plain newline-separated list of repositories, not JSON.

Add this exact line:

```text
TheWillMiller/tide-wise
```

Alphabetical placement should be near the other `The...` repositories, after:

```text
TheRealEiskaffee/brightness-overlay
```

and before:

```text
TheScubadiver/camera-gallery-card
```

## Pre-Submission Checklist

- Repository is public.
- Issues are enabled.
- Repository is not archived.
- GitHub description is set.
- GitHub topics are set.
- `hacs.json` exists in the repository root.
- `hacs.json` points to `tidewise-card.js`.
- `tidewise-card.js` exists in the repository root.
- HACS validation workflow passes with `category: plugin`.
- GitHub identifies the repository license as MIT, not `NOASSERTION`.
- Frontend syntax check workflow passes.
- Latest version is a full GitHub Release, not only a tag.
- Latest release includes `tidewise-card.js` as an attached asset.
- README includes screenshots, installation steps, troubleshooting, safety notes, privacy notes, and license summary.

## Notes

Do not submit TideWise as an integration. It is a plugin/custom card.

TideWise uses the MIT License so GitHub and HACS can identify the repository license through standard SPDX metadata.
