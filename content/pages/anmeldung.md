+++
title = 'Anmeldung'
date = 2024-09-09T22:52:10+02:00
+++


Test Test


<script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
<script>{{ $app := resources.Get "scripts/app.jsx" | resources.ExecuteAsTemplate "app.js" . | babel  }}
</script>
<script src="{{ $app.RelPermalink }}"></script>

<script src="assets/scripts/app.jsx"></script>
