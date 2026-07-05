# Beta Tester Checklist

1. Install TideWise from the HACS custom repository.
2. Confirm the installed TideWise version.
3. Add TideWise from the dashboard card picker.
4. Open the visual editor.
5. Select the default US NOAA provider and the Cherry Grove, SC station.
6. Save the card.
7. Refresh the dashboard.
8. Confirm the card still loads.
9. If you can test Canada, switch to Canada CHS / DFO and choose a CHS station.
10. If you can test the UK, switch to the UKHO Tides integration sensor provider and choose a UKHO sensor.
11. If you can test another country, switch to Home Assistant tide entity and choose or paste a compatible tide prediction sensor.
12. Confirm the tide chart, current height, next high, and next low render for each tested provider.
13. Change fishing mode.
14. Save and refresh again.
15. Toggle fishing score off/on.
16. Test with missing optional weather/surf entities.
17. Test on desktop.
18. Test on phone.
19. Screenshot any layout issue.
20. Copy browser console errors.
21. Report Home Assistant version.
22. Report HACS version.
23. Report browser/device.
24. Report provider and station/entity ID.
25. For international entity tests, report the prediction attribute name and one sanitized sample row.
26. Report whether installed from release, HACS custom repository, manual resource, or main branch.
27. If successful, star the repo or open a Works For Me / Confirmed Station report.
