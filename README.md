# Starter files for vite with react and tailwindcss

### *clone the repo and do `npm install` and do `npm update` if necesary*


### dependancies 
- **tailwindcss**
- **dayjs for time formating**
- **react-query for server state management**
- **uniqid**
- **react-icons**


### [costom components](src\components\Shared)

### [resct-query](src\main.tsx) :
is preconfigured feel free to omit the defaultConfig if you want default behaviour

tailwind is configured with a few custom classes
```css
.flex-center{
  @apply flex justify-center items-center
}
.flex-center-col{
  @apply flex flex-col justify-center items-center
}
.scroll-bar {
  @apply scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-green-500;
}

```

