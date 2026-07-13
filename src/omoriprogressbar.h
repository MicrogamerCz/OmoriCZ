// SPDX-License-Identifier: GPL-2.0-or-later
// SPDX-FileCopyrightText: 2026 Micro <microgamercz@proton.me>

#pragma once

#include <QWidget>

class OmoriProgressBar : public QWidget {
    Q_OBJECT

  public:
    explicit OmoriProgressBar(QWidget *parent = nullptr);
    ~OmoriProgressBar();

    qreal value() const;
    void setValue(qreal value);

    QSize sizeHint() const override;
    QSize minimumSizeHint() const override;

  protected:
    void paintEvent(QPaintEvent *event) override;
    void resizeEvent(QResizeEvent *event) override;
    int heightForWidth(int w) const override;

  private:
    void updateVariant();
    int effectiveIndex() const;

    QTimer *variantTimer;
    qreal m_value = 0.0;
    int m_variant = 0;
    QPixmap m_frames[2][10];
    QSize m_pixmapSize;
};
