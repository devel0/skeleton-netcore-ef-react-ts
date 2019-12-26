FROM searchathing/dotnet:3.0.100-sdk AS base
WORKDIR /app

FROM searchathing/dotnet:3.0.100-sdk AS build

# cache nuget
WORKDIR /src/srvapp
COPY ["srvapp/srvapp.csproj", "."]
RUN dotnet restore -v n .

# cache npm
WORKDIR /src/srvapp/ClientApp
COPY ["srvapp/ClientApp/package-dkcache.json", "package.json"]
COPY ["srvapp/ClientApp/.yalc", ".yalc"]
RUN npm install

# now copy sources
WORKDIR /src
COPY . .
RUN dotnet build srvapp -c Release -o /app

FROM build AS publish
RUN dotnet publish srvapp -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .

ENV ASPNETCORE_URLS "http://*:5000"

ENTRYPOINT ["dotnet", "srvapp.dll"]
