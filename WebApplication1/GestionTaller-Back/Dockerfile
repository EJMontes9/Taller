FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["GestionTaller-Back/GestionTaller-Back.csproj", "GestionTaller-Back/"]
RUN dotnet restore "GestionTaller-Back/GestionTaller-Back.csproj"
COPY . .
WORKDIR "/src/GestionTaller-Back"
RUN dotnet build "GestionTaller-Back.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "GestionTaller-Back.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GestionTaller-Back.dll"]
