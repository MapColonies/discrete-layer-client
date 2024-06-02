{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "app.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "app.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "app.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Returns the environment from global if exists or from the chart's values, defaults to development
*/}}
{{- define "app.environment" -}}
{{- if .Values.global.environment }}
    {{- .Values.global.environment -}}
{{- else -}}
    {{- .Values.environment | default "development" -}}
{{- end -}}
{{- end -}}

{{/*
Returns the cloud provider docker registry url from global if exists or from the chart's values
*/}}
{{- define "app.cloudProviderDockerRegistryUrl" -}}
{{- if .Values.global.cloudProvider.dockerRegistryUrl }}
    {{- printf "%s" .Values.global.cloudProvider.dockerRegistryUrl -}}
{{- else if .Values.cloudProvider.dockerRegistryUrl -}}
    {{- printf "%s" .Values.cloudProvider.dockerRegistryUrl -}}
{{- else -}}
{{- end -}}
{{- end -}}

{{/*
Returns the cloud provider image pull secret name from global if exists or from the chart's values
*/}}
{{- define "app.cloudProviderImagePullSecretName" -}}
{{- if .Values.global.cloudProvider.imagePullSecretName }}
    {{- .Values.global.cloudProvider.imagePullSecretName -}}
{{- else if .Values.cloudProvider.imagePullSecretName -}}
    {{- .Values.cloudProvider.imagePullSecretName -}}
{{- end -}}
{{- end -}}

{{/*
Returns the cloud provider image pull policy from global if exists or from the chart's values
*/}}
{{- define "app.cloudProviderImagePullPolicy" -}}
{{- if .Values.global.cloudProvider.imagePullPolicy }}
    {{- .Values.global.cloudProvider.imagePullPolicy -}}
{{- else if .Values.cloudProvider.imagePullPolicy -}}
    {{- .Values.cloudProvider.imagePullPolicy -}}
{{- end -}}
{{- end -}}

{{/*
Returns the cloud provider name from global if exists or from the chart's values, defaults to minikube
*/}}
{{- define "app.cloudProviderFlavor" -}}
{{- if .Values.cloudProvider -}}
    {{- .Values.cloudProvider.flavor | default "minikube" -}}
{{- else -}}
    {{ "minikube" }}
{{- end -}}
{{- end -}}
