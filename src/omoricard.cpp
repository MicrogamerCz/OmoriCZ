// SPDX-License-Identifier: GPL-2.0-or-later
// SPDX-FileCopyrightText: 2026 Micro <microgamercz@proton.me>

#include "omoricard.h"
#include <QPainter>
#include <qnamespace.h>
#include <qoverload.h>
#include <qwidget.h>

OmoriCard::OmoriCard(QWidget *parent) : QWidget(parent), m_innerFrame(false) {
    int margin = 20;
    setContentsMargins(margin * 2, margin, margin * 2, margin);

    connect(this, &OmoriCard::innerFrameChanged, this, QOverload<>::of(&OmoriCard::update));
}

bool OmoriCard::innerFrame() const {
    return m_innerFrame;
}
void OmoriCard::setInnerFrame(bool infr) {
    m_innerFrame = infr;
    Q_EMIT innerFrameChanged(infr);
}

void OmoriCard::resizeEvent(QResizeEvent *event) {
    Q_UNUSED(event)

    if (layout()) {
        layout();
        return;
    }

    for (QObject *child : children()) {
        if (QWidget *label = qobject_cast<QWidget *>(child))
            label->setGeometry(rect().marginsAdded(QMargins(20, 20, 20, 20)));
    }
}

void OmoriCard::paintEvent(QPaintEvent *) {
    QPainter p(this);
    p.setRenderHint(QPainter::Antialiasing, false);

    p.fillRect(rect(), Qt::black);
    p.fillRect(rect().adjusted(2, 2, -2, -2), Qt::white);
    p.fillRect(rect().adjusted(9, 9, -9, -9), Qt::black);

    if (!innerFrame())
        return;

    p.fillRect(rect().adjusted(11, 11, -11, -11), Qt::white);
}
