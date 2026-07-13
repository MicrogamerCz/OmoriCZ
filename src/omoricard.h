// SPDX-License-Identifier: GPL-2.0-or-later
// SPDX-FileCopyrightText: 2026 Micro <microgamercz@proton.me>

#pragma once
#include <QWidget>
#include <qobject.h>
#include <qtmetamacros.h>

class OmoriCard : public QWidget {
    Q_OBJECT

    bool m_innerFrame;

  public:
    OmoriCard(QWidget *parent = nullptr);

    bool innerFrame() const;
    void setInnerFrame(bool infr);
    Q_SIGNAL void innerFrameChanged(bool infr);

  protected:
    void resizeEvent(QResizeEvent *event) override;
    void paintEvent(QPaintEvent *) override;
};
