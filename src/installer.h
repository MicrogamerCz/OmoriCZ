// SPDX-License-Identifier: GPL-2.0-or-later
// SPDX-FileCopyrightText: 2026 Micro <microgamercz@proton.me>

#pragma once

#include <QObject>
#include <QtGlobal>
#include <qobject.h>
#include <qurl.h>

using namespace Qt::Literals::StringLiterals;

class Installer : public QObject {
    Q_OBJECT

    const QString omoriSteamID = u"1150690"_s;
#ifdef Q_OS_LINUX
    const QUrl steamPath = QUrl::fromLocalFile(u"~/.local/share/Steam/steamapps"_s);
#elifdef Q_OS_WINDOWS
    const QUrl steamPath = QUrl::fromLocalFile(u"C:\\Program Files (x86)\\Steam\\steamapps\\"_s);
#else
    const QUrl steamPath = QUrl::fromLocalFile(u"~/Library/Application Support/Steam/steamapps/"_s);
#endif
    QString m_message;
    int m_progress;

  public:
    Installer(QObject *parent = nullptr);
    Q_SIGNAL void dataChanged();
    Q_SLOT void beginSetup();
};
