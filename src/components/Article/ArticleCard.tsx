import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import {
  getArticleStatusLabel,
  getFileById,
  getStatusLabel,
} from '../../library/utilities/helperFunction';
import { ARTICLE_STATUS, ArticleTabStatus, MAX_DESCRIPTION_LINES } from '../../config/constants';
import { MaterialIcons } from '@expo/vector-icons';
import { IArticleCardProps } from '../../screens/Articles/Articles.model';
import ImagePreviewer from '../ImagePreviewer';
import { useCapitalizedTranslation } from '../../hooks/useCapitalizedTranslation';

const ArticleCard = (props: IArticleCardProps) => {
  const { t } = useCapitalizedTranslation();
  const { article, activeTab, selectedArticleId, toggleSelection, handleKnowMore, imageUrl } =
    props;
  const [showToggle, setShowToggle] = useState(false);
  const companyHasUserHasProductStatus = useMemo(() => {
    return getStatusLabel(article?.companyHasUserProduct?.status);
  }, [article?.companyHasUserProduct?.status]);

  const articleStatus = useMemo(() => {
    if (article?.status === ARTICLE_STATUS.PLANNED) return null;
    return getArticleStatusLabel(article?.status);
  }, [article.status]);

  const isArticleSelected = useMemo(() => {
    return activeTab === ArticleTabStatus.NEW && selectedArticleId === article.id;
  }, [activeTab, selectedArticleId, article.id]);

  return (
    <Pressable
      onPress={() => {
        if (activeTab === ArticleTabStatus.NEW)
          toggleSelection(article.id, article?.company?.stripe_publish_key);
      }}
      style={[
        styles.card,
        activeTab === ArticleTabStatus.NEW && isArticleSelected ? styles.cardSelected : null,
      ]}
    >
      {isArticleSelected && activeTab === ArticleTabStatus.NEW && (
        <View style={styles.checkIcon}>
          <MaterialIcons name="check-circle" size={24} color="#007aff" />
        </View>
      )}

      {companyHasUserHasProductStatus && activeTab === ArticleTabStatus.MY_ARTICLES && (
        <View style={styles.topRightLabel}>
          <View
            style={[styles.statusTag, { backgroundColor: companyHasUserHasProductStatus.color }]}
          >
            <Text style={styles.statusText}>{companyHasUserHasProductStatus.label}</Text>
          </View>
        </View>
      )}

      <View style={styles.rowLayout}>
        <ImagePreviewer
          uri={imageUrl}
          style={styles.articleThumbnail}
          getNewUri={() => getFileById(article?.file_id!)}
        />
        <View style={styles.articleInfo}>
          <Text style={styles.cardTitle}>📰 {article.title}</Text>
          <Text style={styles.cardPrice}>{article.price ? `₹${article.price}` : 'Free'}</Text>
          <Text
            style={styles.cardDescription}
            numberOfLines={MAX_DESCRIPTION_LINES}
            onTextLayout={(e) => {
              if (!showToggle && e?.nativeEvent?.lines?.length > MAX_DESCRIPTION_LINES) {
                setShowToggle(true);
              }
            }}
          >
            {article.description}
          </Text>

          {showToggle && (
            <TouchableOpacity onPress={() => handleKnowMore?.(article)}>
              <Text style={styles.knowMoreText}>{t('components.button.name.knowMore')}</Text>
            </TouchableOpacity>
          )}

          {articleStatus && activeTab === ArticleTabStatus.MY_ARTICLES && (
            <View style={styles.footerStatusRow}>
              <Text style={styles.footerStatusLabel}>
                {t('objects.article.attributes.status')}:{' '}
              </Text>
              <View style={[styles.statusTagSmall, { backgroundColor: articleStatus.color }]}>
                <Text style={styles.statusTextSmall}>{articleStatus.label}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default ArticleCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: '#007aff',
    backgroundColor: '#e0f0ff',
    shadowColor: '#007aff',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    flexShrink: 1,
    paddingRight: 8,
  },
  cardDate: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 14,
    color: '#444',
    marginVertical: 6,
  },
  cardOrganizer: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  footerStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  footerStatusLabel: {
    fontSize: 13,
    color: '#666',
    marginRight: 4,
  },
  statusTagSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusTextSmall: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '500',
  },
  checkIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  knowMoreText: {
    color: '#007aff',
    fontSize: 14,
    fontWeight: '500',
  },
  articleImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  rowLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },

  articleThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },

  articleInfo: {
    flex: 1,
    flexDirection: 'column',
  },
  topRightLabel: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
  },
});
