// SPDX-License-Identifier: GPL-2.0-or-later
// SPDX-FileCopyrightText: 2026 Micro <microgamercz@proton.me>

#include "installer.h"
#include <QJsonArray>
#include <QJsonDocument>
#include <QJsonObject>
#include <QNetworkReply>
#include <VDF/include/vdf_parser.hpp>
#include <fstream>
#include <qdir.h>
#include <qeventloop.h>
#include <qfloat16.h>
#include <qjsondocument.h>
#include <qlogging.h>
#include <qnetworkaccessmanager.h>
#include <qnetworkreply.h>
#include <qnetworkrequest.h>
#include <qurl.h>

using namespace tyti;

Installer::Installer(QObject *parent) : QObject(parent), m_progress(0) {
}

void Installer::beginSetup() {
    Q_EMIT installingChanged(true);

    Q_EMIT progressChanged(m_progress = 0);
    Q_EMIT messageChanged(u"Příprava"_s);

    QString libraryPath = getLibraryPath();
    if (libraryPath.isEmpty()) {
        Q_EMIT progressChanged(m_progress = 10);
        Q_EMIT messageChanged(u"OMORI není nainstalován"_s);
        return;
    } else if (libraryPath.startsWith(u"_"_s)) {
        Q_EMIT progressChanged(m_progress = 10);
        Q_EMIT messageChanged(u"Nepodařilo se otevřít "_s + libraryPath.left(1));
        return;
    }

    QUrl omoriInstallDir = QUrl::fromLocalFile(libraryPath).resolved(QUrl(u"./steamapps/common/OMORI"_s));

    // Implement optional saves backup

    if (!QDir().exists(omoriInstallDir.resolved(relativeOneloaderPath).toLocalFile())) {
        Q_EMIT messageChanged(u"Získávání informací o Oneloaderu"_s);

        componentName = u"OneLoaderu"_s;
        QNetworkRequest oneloaderRequest = githubLatestRequest(u"rphsoftware"_s, u"oneloader"_s);
        if (oneloaderRequest.url().isEmpty()) {
            Q_EMIT progressChanged(m_progress = 10);
            Q_EMIT messageChanged(u"Nepodařilo se získat URL ke stažení OneLoaderu"_s);
        }
        connect(&nam, &QNetworkAccessManager::finished, this, &Installer::installOneloader);

        QNetworkReply *reply = nam.get(oneloaderRequest);
        connect(reply, &QNetworkReply::downloadProgress, this, &Installer::updateProgress);
    } else
        downloadTranslation();
}

QString Installer::getLibraryPath() {
    QString libraryFoldersPath = steamPath.resolved(QUrl(u"./libraryfolders.vdf"_s)).toLocalFile();

    std::ifstream libraryFoldersFile(libraryFoldersPath.toStdString());
    if (!libraryFoldersFile.is_open()) {
        Q_EMIT progressChanged(m_progress = 10);
        Q_EMIT messageChanged(u"Nepodařilo se otevřít "_s + libraryFoldersPath);
        return u"_libraryFoldersFile"_s;
    }

    auto root = vdf::read(libraryFoldersFile);
    std::string libraryPath;
    for (auto [_, library] : root.childs) {
        std::string &apps = library->childs["apps"]->attribs[omoriSteamID];

        if (!apps.empty()) {
            libraryPath = library->attribs["path"];
            break;
        }
    }

    return QString::fromStdString(libraryPath + "/");
}

QNetworkRequest Installer::githubLatestRequest(const QString &owner, const QString &repo) {
    QNetworkRequest repoRequest(QUrl(u"https://api.github.com/repos/%1/%2/releases/latest"_s.arg(owner).arg(repo)));
    repoRequest.setHeader(QNetworkRequest::UserAgentHeader, u"Omopatch"_s);

    QNetworkReply *reply = nam.get(repoRequest);

    QEventLoop syncLoop;
    connect(&nam, &QNetworkAccessManager::finished, &syncLoop, &QEventLoop::quit);
    syncLoop.exec();

    QByteArray repoData = reply->readAll();

    QString downloadUrl;
    QJsonObject root = QJsonDocument::fromJson(repoData).object();
    for (QJsonValueRef asset : root[u"assets"_s].toArray()) {
        if (!asset.isObject())
            continue;

        QString url = asset.toObject()[u"browser_download_url"_s].toString();
        if (!url.endsWith(u".zip"_s))
            continue;

        downloadUrl = url;
        break;
    }

    return QNetworkRequest(QUrl(downloadUrl));
}

void Installer::updateProgress(qint64 bytesReceived, qint64 bytesTotal) {
    qreal percentage = qreal(bytesReceived) / qreal(bytesTotal);
    if (qIsNaN(percentage))
        return;

    Q_EMIT messageChanged(u"Stahování %1... (%2%)"_s.arg(componentName).arg(qRound(percentage * 100)));
    Q_EMIT progressChanged(percentage);
}

void Installer::installOneloader(QNetworkReply *reply) {
    disconnect(&nam, &QNetworkAccessManager::finished, this, &Installer::installOneloader);
    disconnect(reply, &QNetworkReply::downloadProgress, this, &Installer::updateProgress);

    if (reply->error() != QNetworkReply::NoError) {
        Q_EMIT progressChanged(m_progress = 10);
        Q_EMIT messageChanged(u"Problém u stahování OneLoaderu: '%1'"_s.arg(reply->errorString()));
        return;
    }

    QByteArray replyData = reply->readAll();
    // TODO: extract

    downloadTranslation();
}

void Installer::downloadTranslation() {
    Q_EMIT progressChanged(m_progress = 0);
    Q_EMIT messageChanged(u"Získávání informací o překladu"_s);
    componentName = u"českého překladu"_s;

    QNetworkRequest translationRequest = githubLatestRequest(u"MicrogamerCz"_s, u"OmoriCz"_s);
    if (translationRequest.url().isEmpty()) {
        Q_EMIT progressChanged(m_progress = 10);
        Q_EMIT messageChanged(u"Nepodařilo se získat URL ke stažení překladu"_s);
    }
    connect(&nam, &QNetworkAccessManager::finished, this, &Installer::installTranslation);

    QNetworkReply *reply = nam.get(translationRequest);
    connect(reply, &QNetworkReply::downloadProgress, this, &Installer::updateProgress);
}

void Installer::installTranslation(QNetworkReply *reply) {
    disconnect(&nam, &QNetworkAccessManager::finished, this, &Installer::installTranslation);
    disconnect(reply, &QNetworkReply::downloadProgress, this, &Installer::updateProgress);

    if (reply->error() != QNetworkReply::NoError) {
        Q_EMIT progressChanged(m_progress = 10);
        Q_EMIT messageChanged(u"Problém u stahování překladu: '%1'"_s.arg(reply->errorString()));
        return;
    }

    QByteArray replyData = reply->readAll();
    // TODO: extract
}
