// SPDX-License-Identifier: GPL-2.0-or-later
// SPDX-FileCopyrightText: 2026 Micro <microgamercz@proton.me>

#pragma once

#include <QNetworkAccessManager>
#include <QObject>
#include <QtGlobal>
#include <QtQml/qqmlengine.h>
#include <qobject.h>
#include <qtmetamacros.h>
#include <qurl.h>
#include <qvariant.h>

using namespace Qt::Literals::StringLiterals;

class Installer : public QObject {
    Q_OBJECT

    const std::string omoriSteamID = "1150690";
    const QUrl relativeModsPath = QUrl(u"./www/mods/"_s);
    const QUrl relativeOneloaderPath = QUrl(u"./www/modloader/"_s);
    const QUrl relativeSavesPath = QUrl(u"./www/save/"_s);

#ifdef Q_OS_LINUX
    const QUrl steamPath = QUrl::fromLocalFile(qEnvironmentVariable("HOME") + u"/.local/share/Steam/steamapps/"_s);
#elifdef Q_OS_WINDOWS
    const QUrl steamPath = QUrl::fromLocalFile(u"C:\\Program Files (x86)\\Steam\\steamapps\\"_s);
#elifdef Q_OS_MACOS
    const QUrl steamPath = QUrl::fromLocalFile(u"~/Library/Application Support/Steam/steamapps/"_s);
#endif

    QUrl omoriInstallDir;
    QString componentName;
    int m_progress;
    QNetworkAccessManager nam;

    QString getLibraryPath();
    QNetworkRequest githubLatestRequest(const QString &owner, const QString &repo);
    void updateProgress(qint64 bytesReceived, qint64 bytesTotal);
    void installOneloader(QNetworkReply *reply);
    void downloadTranslation();
    void installTranslation(QNetworkReply *reply);
    bool extractData(QByteArray &data, const QUrl &url) const;

  public:
    Installer(QObject *parent = nullptr);
    Q_SLOT void beginSetup();
  Q_SIGNALS:
    void progressChanged(qreal progress);
    void messageChanged(const QString &message);
    void installingChanged(bool installing);
    void finishedInstall();
};
